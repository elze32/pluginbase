#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod window_detector;
mod plugin_matcher;

use std::fs;
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayMenu, SystemTrayMenuItem};


// ─── État partagé — plugin actif ─────────────────────────────────────────────

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
struct ActivePlugin {
    plugin_name: String,
    format: String,
    raw_title: String,
}

struct ActivePluginState(Arc<Mutex<Option<ActivePlugin>>>);

// ─── Config ──────────────────────────────────────────────────────────────────

#[derive(serde::Deserialize, serde::Serialize, Clone)]
struct AppConfig {
    token: String,
    api_url: String,
}

fn config_path() -> Option<std::path::PathBuf> {
    let appdata = std::env::var("APPDATA").ok()?;
    Some(Path::new(&appdata).join("PluginBase").join("config.json"))
}

fn load_config() -> Option<AppConfig> {
    let path = config_path()?;
    let content = fs::read_to_string(&path).ok()?;
    serde_json::from_str(&content).ok()
}

// ─── Commandes Tauri (appelées depuis l'UI React) ────────────────────────────

/// Sauvegarde token + URL de l'API dans %APPDATA%\PluginBase\config.json
#[tauri::command]
fn save_config(token: String, api_url: String) -> Result<(), String> {
    let appdata = std::env::var("APPDATA").map_err(|e| e.to_string())?;
    let dir = Path::new(&appdata).join("PluginBase");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let config = AppConfig { token, api_url };
    let json = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(dir.join("config.json"), json).map_err(|e| e.to_string())?;
    Ok(())
}

/// Retourne la config actuelle (null si pas de config)
#[tauri::command]
fn get_config() -> Option<AppConfig> {
    load_config()
}

/// Supprime la config (déconnexion de l'overlay)
#[tauri::command]
fn clear_config() -> Result<(), String> {
    if let Some(path) = config_path() {
        if path.exists() {
            fs::remove_file(&path).map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

/// Affiche l'overlay manuellement (depuis le panneau de contrôle)
#[tauri::command]
fn show_overlay(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(w) = app.get_window("overlay") {
        w.show().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Masque l'overlay manuellement
#[tauri::command]
fn hide_overlay(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(w) = app.get_window("overlay") {
        w.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Retourne true si l'overlay est actuellement visible
#[tauri::command]
fn overlay_visible(app: tauri::AppHandle) -> bool {
    app.get_window("overlay")
        .and_then(|w| w.is_visible().ok())
        .unwrap_or(false)
}

/// Debug — retourne tous les titres de fenêtres visibles sur le système
#[tauri::command]
fn get_window_titles() -> Vec<String> {
    window_detector::get_all_window_titles()
}

/// Retourne le plugin actif détecté (ou null) — polling depuis le frontend
#[tauri::command]
fn get_active_plugin(state: tauri::State<ActivePluginState>) -> Option<ActivePlugin> {
    state.0.lock().ok()?.clone()
}

// ─── Deletion worker ─────────────────────────────────────────────────────────

#[derive(serde::Deserialize)]
struct PendingDeletion {
    id: String,
    #[serde(rename = "pluginNameRaw")]
    plugin_name_raw: String,
    format: String,
    #[serde(rename = "installPath")]
    install_path: String,
}

#[derive(serde::Deserialize)]
struct PendingDeletionsResponse {
    data: Vec<PendingDeletion>,
}

#[derive(serde::Serialize, Clone, Debug)]
struct DeletionResult {
    id: String,
    plugin_name: String,
    install_path: String,
    success: bool,
    error: Option<String>,
}

/// Vérifie que le chemin pointe vers un fichier plugin sur disque — pas un chemin système dangereux.
/// On accepte tout chemin absolu vers un fichier/dossier avec une extension plugin connue,
/// ou tout chemin dans un répertoire plugin standard.
fn is_safe_plugin_path(path: &str) -> bool {
    let p = path.trim_end_matches(['/', '\\']).to_lowercase();

    // Extensions plugin reconnues
    if p.ends_with(".vst3")
        || p.ends_with(".clap")
        || p.ends_with(".aax")
        || p.ends_with(".component")
        || p.ends_with(".au")
    {
        return true;
    }

    // .dll dans un dossier VST standard
    if p.ends_with(".dll") {
        return p.contains("\\vst")
            || p.contains("/vst")
            || p.contains("\\plugins")
            || p.contains("/plugins");
    }

    // Chemin dans un répertoire plugin standard (sans extension reconnue)
    let in_plugin_dir = p.contains("\\vst3\\")
        || p.contains("/vst3/")
        || p.contains("\\vst2\\")
        || p.contains("/vst2/")
        || p.contains("\\vst\\")
        || p.contains("/vst/")
        || p.contains("\\clap\\")
        || p.contains("/clap/")
        || p.contains("\\common files\\avid\\audio\\plug-ins")
        || p.contains("\\audio\\plug-ins");

    if in_plugin_dir {
        // Ne pas accepter si c'est clairement un fichier système critique
        let is_system = p.contains("\\windows\\")
            || p.contains("\\system32\\")
            || p.contains("\\syswow64\\");
        return !is_system;
    }

    false
}

fn delete_plugin_path(path: &str) -> Result<(), String> {
    let clean = path.trim_end_matches(['/', '\\']);
    let p = Path::new(clean);
    if !p.exists() {
        return Ok(()); // Déjà absent — succès silencieux
    }
    let result = if p.is_dir() {
        fs::remove_dir_all(p)
    } else {
        fs::remove_file(p)
    };

    match result {
        Ok(()) => Ok(()),
        Err(e) if e.raw_os_error() == Some(5) => {
            Err("ADMIN_REQUIRED".to_string())
        }
        Err(e) => Err(e.to_string()),
    }
}

/// Exécute une passe de suppressions en attente.
/// Retourne la liste des résultats (succès/échec pour chaque plugin).
fn run_deletion_pass(client: &reqwest::blocking::Client, config: &AppConfig) -> Vec<DeletionResult> {
    let mut results = Vec::new();

    let url = format!("{}/api/v1/scanner/pending-deletions", config.api_url);
    let resp = client.get(&url).bearer_auth(&config.token).send();

    let pending_list = match resp {
        Ok(r) if r.status().is_success() => {
            match r.json::<PendingDeletionsResponse>() {
                Ok(body) => body.data,
                Err(e) => {
                    eprintln!("[deletion] Erreur parsing réponse : {}", e);
                    return results;
                }
            }
        }
        Ok(r) if r.status() == 401 => {
            eprintln!("[deletion] Token invalide ou expiré (401)");
            return results;
        }
        Ok(r) => {
            eprintln!("[deletion] Statut HTTP inattendu : {}", r.status());
            return results;
        }
        Err(e) => {
            eprintln!("[deletion] Erreur réseau : {}", e);
            return results;
        }
    };

    if pending_list.is_empty() {
        return results;
    }

    println!("[deletion] {} suppression(s) en attente", pending_list.len());

    for item in pending_list {
        println!("[deletion] {} ({}) → {}", item.plugin_name_raw, item.format, item.install_path);

        // Sécurité : on ne supprime que des chemins plugin connus
        if !is_safe_plugin_path(&item.install_path) {
            let error = format!("Chemin refusé (extension non reconnue) : {}", item.install_path);
            eprintln!("[deletion] REFUS : {}", error);

            let confirm_url = format!("{}/api/v1/scanner/confirm-deletion", config.api_url);
            let _ = client
                .post(&confirm_url)
                .bearer_auth(&config.token)
                .json(&serde_json::json!({ "id": item.id, "success": false, "error": error }))
                .send();

            results.push(DeletionResult {
                id: item.id.clone(),
                plugin_name: item.plugin_name_raw,
                install_path: item.install_path,
                success: false,
                error: Some("Chemin non reconnu comme plugin".to_string()),
            });
            continue;
        }

        let (success, error_msg) = match delete_plugin_path(&item.install_path) {
            Ok(()) => {
                println!("[deletion] Supprimé : {}", item.install_path);
                (true, None)
            }
            Err(e) => {
                eprintln!("[deletion] Échec : {}", e);
                (false, Some(e))
            }
        };

        let confirm_url = format!("{}/api/v1/scanner/confirm-deletion", config.api_url);
        let body = if success {
            serde_json::json!({ "id": item.id, "success": true })
        } else {
            serde_json::json!({
                "id": item.id,
                "success": false,
                "error": error_msg.clone().unwrap_or_else(|| "Erreur inconnue".to_string())
            })
        };

        if let Err(e) = client
            .post(&confirm_url)
            .bearer_auth(&config.token)
            .json(&body)
            .send()
        {
            eprintln!("[deletion] Erreur confirmation API : {}", e);
        }

        results.push(DeletionResult {
            id: item.id,
            plugin_name: item.plugin_name_raw,
            install_path: item.install_path,
            success,
            error: error_msg,
        });
    }

    results
}

/// Commande Tauri — retourne les titres de fenêtres ET ce que le matcher détecte
#[tauri::command]
fn get_detection_debug() -> serde_json::Value {
    let titles = window_detector::get_all_window_titles();
    let detected = plugin_matcher::find_active_plugin(&titles);
    serde_json::json!({
        "titles": titles,
        "detected": detected.map(|d| serde_json::json!({
            "plugin_name": d.plugin_name,
            "format": d.format,
            "raw_title": d.raw_title,
            "confidence": d.confidence,
        }))
    })
}

/// Commande Tauri — déclenche immédiatement une passe de suppressions
#[tauri::command]
fn force_deletion_check() -> Vec<DeletionResult> {
    let client = reqwest::blocking::Client::new();
    match load_config() {
        Some(config) => run_deletion_pass(&client, &config),
        None => vec![],
    }
}

/// Commande Tauri — retourne le nombre de suppressions en attente (sans les exécuter)
#[tauri::command]
fn get_pending_deletions_count() -> u32 {
    let client = reqwest::blocking::Client::new();
    let config = match load_config() {
        Some(c) => c,
        None => return 0,
    };
    let url = format!("{}/api/v1/scanner/pending-deletions", config.api_url);
    match client.get(&url).bearer_auth(&config.token).send() {
        Ok(r) if r.status().is_success() => {
            r.json::<PendingDeletionsResponse>()
                .map(|b| b.data.len() as u32)
                .unwrap_or(0)
        }
        _ => 0,
    }
}

/// Worker qui tourne en permanence (poll toutes les 10s).
fn run_deletion_worker() {
    let client = reqwest::blocking::Client::new();
    loop {
        thread::sleep(Duration::from_secs(10));
        if let Some(config) = load_config() {
            run_deletion_pass(&client, &config);
        }
    }
}

// ─── App ─────────────────────────────────────────────────────────────────────

#[derive(Clone, serde::Serialize)]
struct PluginDetectedPayload {
    plugin_name: String,
    raw_title: String,
    format: String,
}

fn main() {
    let active_plugin_state = ActivePluginState(Arc::new(Mutex::new(None)));
    let active_plugin_arc = active_plugin_state.0.clone();

    tauri::Builder::default()
        .manage(active_plugin_state)
        .system_tray(build_tray())
        .on_system_tray_event(|app, event| {
            handle_tray_event(app, event);
        })
        .invoke_handler(tauri::generate_handler![
            save_config, get_config, clear_config,
            show_overlay, hide_overlay, overlay_visible,
            get_window_titles, get_active_plugin,
            get_detection_debug,
            force_deletion_check, get_pending_deletions_count
        ])
        .setup(move |app| {
            let app_handle = app.handle();

            // ── Gère les Deep Links (pluginbase://...) ───────────────────
            let handle_link = app_handle.clone();
            app.listen_global("tauri://deep-link", move |event| {
                if let Some(payload) = event.payload() {
                    if payload.contains("open") {
                        if let Some(control) = handle_link.get_window("control") {
                            let _ = control.show();
                            let _ = control.set_focus();
                        }
                    }
                }
            });

            // ── Affiche le panneau de contrôle au démarrage ──────────────
            if let Some(control) = app_handle.get_window("control") {
                let _ = control.show();
            }

            // ── Détection de fenêtres plugins ────────────────────────────
            let arc_for_thread = active_plugin_arc.clone();
            thread::spawn(move || {
                let mut candidate: Option<String> = None;
                let mut candidate_hits: u32 = 0;
                let mut none_streak: u32 = 0;

                // 1 confirmation avant d'afficher, 4 avant de fermer
                const CONFIRM: u32 = 1;
                const CLOSE:   u32 = 4;

                loop {
                    thread::sleep(Duration::from_millis(200));

                    let titles = window_detector::get_all_window_titles();
                    let detected = plugin_matcher::find_active_plugin(&titles);

                    match detected {
                        Some(plugin) => {
                            none_streak = 0;

                            if candidate.as_deref() == Some(&plugin.plugin_name) {
                                candidate_hits += 1;
                            } else {
                                candidate = Some(plugin.plugin_name.clone());
                                candidate_hits = 1;
                            }

                            if candidate_hits >= CONFIRM {
                                // Mettre à jour l'état partagé (polling frontend)
                                if let Ok(mut lock) = arc_for_thread.lock() {
                                    let already_same = lock.as_ref()
                                        .map(|p: &ActivePlugin| p.plugin_name == plugin.plugin_name)
                                        .unwrap_or(false);
                                    if !already_same {
                                        println!("[detect] Plugin: {} [{}]", plugin.plugin_name, plugin.format);
                                        *lock = Some(ActivePlugin {
                                            plugin_name: plugin.plugin_name.clone(),
                                            format: plugin.format.clone(),
                                            raw_title: plugin.raw_title.clone(),
                                        });
                                        // Émettre aussi l'événement pour compatibilité
                                        app_handle.emit_all("plugin-detected", PluginDetectedPayload {
                                            plugin_name: plugin.plugin_name.clone(),
                                            raw_title: plugin.raw_title.clone(),
                                            format: plugin.format.clone(),
                                        }).ok();
                                    }
                                }
                            }
                        }
                        None => {
                            none_streak += 1;
                            candidate = None;
                            candidate_hits = 0;

                            if none_streak >= CLOSE {
                                if let Ok(mut lock) = arc_for_thread.lock() {
                                    if lock.is_some() {
                                        println!("[detect] Plugin fermé");
                                        *lock = None;
                                        app_handle.emit_all("plugin-closed", ()).ok();
                                    }
                                }
                            }
                        }
                    } // fin match
                } // fin loop
            }); // fin thread::spawn

            // ── Deletion worker — toujours actif, relit la config chaque tick ──
            thread::spawn(move || {
                run_deletion_worker();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Erreur au démarrage de l'overlay");
}

fn build_tray() -> SystemTray {
    let quit       = CustomMenuItem::new("quit",    "Quitter PluginBase");
    let toggle     = CustomMenuItem::new("toggle",  "Afficher / Masquer l'overlay");
    let control    = CustomMenuItem::new("control", "Panneau de contrôle");
    let menu = SystemTrayMenu::new()
        .add_item(control)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(toggle)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    SystemTray::new().with_menu(menu)
}

fn handle_tray_event(app: &tauri::AppHandle, event: tauri::SystemTrayEvent) {
    match event {
        tauri::SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => std::process::exit(0),
            "toggle" => {
                if let Some(w) = app.get_window("overlay") {
                    if w.is_visible().unwrap_or(false) { let _ = w.hide(); }
                    else { let _ = w.show(); }
                }
            }
            "control" => {
                if let Some(w) = app.get_window("control") {
                    let _ = w.show();
                    let _ = w.set_focus();
                }
            }
            _ => {}
        },
        // Double-clic sur l'icône tray → ouvre le panneau de contrôle
        tauri::SystemTrayEvent::DoubleClick { .. } => {
            if let Some(w) = app.get_window("control") {
                let _ = w.show();
                let _ = w.set_focus();
            }
        }
        _ => {}
    }
}
