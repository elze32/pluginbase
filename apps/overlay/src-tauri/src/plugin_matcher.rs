use serde::{Deserialize, Serialize};
use regex::Regex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetectedPlugin {
    pub raw_title: String,
    pub plugin_name: String,
    pub confidence: f32,
    pub format: String,
}

/// Marques connues — utilisées pour filtrer les fenêtres enfants sans format standard
const KNOWN_BRANDS: &[&str] = &[
    "arturia", "fabfilter", "native instruments", "soundtoys", "waves",
    "valhalla", "valhalla dsp", "izotope", "xfer", "u-he", "spectrasonics", "celemony",
    "antares", "xlnaudio", "plugin alliance", "slate digital", "brainworx",
    "softube", "eventide", "sugar bytes", "output", "heavyocity",
    "east west", "spitfire", "kontakt", "serum", "massive", "omnisphere",
    "pigments", "analog lab", "mini v", "arp 2600", "prophet", "diva",
    "zebra", "hive", "phase plant", "vital", "surge", "ozone", "neutron",
    "rx ", "rx8", "rx9", "rx10", "rx11", "soundid", "sonarworks",
    "slate", "black hole", "shimmer", "supermassive", "room", "reverb",
    "kirchhoff", "pro-q", "pro-l", "pro-mb", "pro-c", "pro-g", "pro-r",
    "saturn", "timeless", "volcano", "simplon", "one",
    "fab filter", "fab-filter",
];

/// Noms de plugins standalone connus — fenêtres dont le titre EST le nom du plugin
const STANDALONE_PLUGINS: &[&str] = &[
    "ValhallaSupermassive", "ValhallaRoom", "ValhallaVintageVerb", "ValhallaDelay",
    "ValhallaDSP", "ValhallaUberMod", "ValhallaFreqEcho", "ValhallaShimmer",
    "Serum", "Vital", "Surge XT", "Surge",
    "Omnisphere", "Keyscape", "Trilian",
    "Kontakt", "Kontakt 7", "Kontakt 6",
    "Pigments", "Analog Lab", "Mini V", "Prophet-VS",
    "Diva", "Zebra2", "Hive", "Phase Plant",
    "Ozone", "Neutron", "Nectar", "RX ",
    "Pro-Q 3", "Pro-Q 4", "Pro-L 2", "Pro-MB", "Pro-C 2", "Pro-G", "Pro-R 2",
    "Saturn 2", "Timeless 3", "Volcano 3",
];

pub fn find_active_plugin(all_windows: &[String]) -> Option<DetectedPlugin> {
    // ── Patterns Reaper — fenêtre flottante ──────────────────────────────────
    // "VST3: Pro-Q 3 (FabFilter)"
    let reaper_vst3 = Regex::new(r"^VST3: (.+?) \((.+?)\)").unwrap();
    // "VSTi: Pigments (Arturia)"  — instruments VST2
    let reaper_vsti = Regex::new(r"^VSTi: (.+?) \((.+?)\)").unwrap();
    // "VST: Naam (Brand)"         — effets VST2
    let reaper_vst2 = Regex::new(r"^VST: (.+?) \((.+?)\)").unwrap();
    // "CLAP: Pro-Q 4 (FabFilter)"
    let reaper_clap = Regex::new(r"^CLAP: (.+?) \((.+?)\)").unwrap();
    // "AU: Naam (Brand)"           — macOS Audio Unit
    let reaper_au = Regex::new(r"^AU: (.+?) \((.+?)\)").unwrap();

    // ── Patterns fenêtre FX Reaper embarquée ────────────────────────────────
    // "FX: Track 1: Pigments (Arturia)"
    let reaper_fx_full = Regex::new(r"^FX: .+?: (.+?) \((.+?)\)").unwrap();

    // ── Pattern générique "Nom (Marque)" ─────────────────────────────────────
    let generic_paren = Regex::new(r"^(.+?) \((.+?)\)$").unwrap();

    for title in all_windows {
        // 1. VST3 flottant
        if let Some(caps) = reaper_vst3.captures(title) {
            return Some(DetectedPlugin {
                raw_title: title.clone(),
                plugin_name: caps[1].trim().to_string(),
                confidence: 1.0,
                format: "VST3".to_string(),
            });
        }

        // 2. VSTi (instrument VST2) flottant
        if let Some(caps) = reaper_vsti.captures(title) {
            return Some(DetectedPlugin {
                raw_title: title.clone(),
                plugin_name: caps[1].trim().to_string(),
                confidence: 1.0,
                format: "VST2".to_string(),
            });
        }

        // 3. VST2 effet flottant
        if let Some(caps) = reaper_vst2.captures(title) {
            return Some(DetectedPlugin {
                raw_title: title.clone(),
                plugin_name: caps[1].trim().to_string(),
                confidence: 1.0,
                format: "VST2".to_string(),
            });
        }

        // 4. CLAP flottant
        if let Some(caps) = reaper_clap.captures(title) {
            return Some(DetectedPlugin {
                raw_title: title.clone(),
                plugin_name: caps[1].trim().to_string(),
                confidence: 1.0,
                format: "CLAP".to_string(),
            });
        }

        // 5. AU (macOS) flottant
        if let Some(caps) = reaper_au.captures(title) {
            return Some(DetectedPlugin {
                raw_title: title.clone(),
                plugin_name: caps[1].trim().to_string(),
                confidence: 1.0,
                format: "AU".to_string(),
            });
        }

        // 6. FX chain Reaper avec plugin dans le titre
        if let Some(caps) = reaper_fx_full.captures(title) {
            return Some(DetectedPlugin {
                raw_title: title.clone(),
                plugin_name: caps[1].trim().to_string(),
                confidence: 0.95,
                format: "VST3".to_string(),
            });
        }

        // 7. Plugins standalone dont le titre exact correspond
        for &plugin_name in STANDALONE_PLUGINS {
            if title.trim() == plugin_name
                || title.starts_with(&format!("{} - ", plugin_name))
                || title.starts_with(&format!("{} v", plugin_name))
            {
                return Some(DetectedPlugin {
                    raw_title: title.clone(),
                    plugin_name: plugin_name.to_string(),
                    confidence: 0.9,
                    format: "AUTO".to_string(),
                });
            }
        }

        // 8. Fenêtres dont le titre contient une marque connue
        //    (plugins embarqués sans format standard)
        let lower = title.to_lowercase();
        let is_brand_match = KNOWN_BRANDS.iter().any(|b| lower.contains(b));

        if is_brand_match && title.len() < 100 && !title.starts_with("FX: ") {
            let is_system = lower.contains("microsoft")
                || lower.contains("windows")
                || lower.contains("explorer")
                || lower.contains("taskbar")
                || lower.contains("settings")
                || lower.contains("program files");

            if !is_system {
                return Some(DetectedPlugin {
                    raw_title: title.clone(),
                    plugin_name: title.clone(),
                    confidence: 0.75,
                    format: "AUTO".to_string(),
                });
            }
        }

        // 9. Pattern générique "Nom (Marque)" — filet de sécurité
        if let Some(caps) = generic_paren.captures(title) {
            let name = caps[1].trim();
            let brand = caps[2].trim().to_lowercase();
            let brand_known = KNOWN_BRANDS.iter().any(|b| brand.contains(b));
            if brand_known && name.len() < 60 {
                return Some(DetectedPlugin {
                    raw_title: title.clone(),
                    plugin_name: name.to_string(),
                    confidence: 0.85,
                    format: "AUTO".to_string(),
                });
            }
        }
    }

    None
}
