use windows::Win32::Foundation::{BOOL, HWND, LPARAM};
use windows::Win32::UI::WindowsAndMessaging::{
    EnumChildWindows, EnumWindows, GetWindowTextW, IsWindowVisible,
};

fn get_hwnd_title(hwnd: HWND) -> Option<String> {
    let mut buf = vec![0u16; 512];
    let len = unsafe { GetWindowTextW(hwnd, &mut buf) } as usize;
    if len == 0 {
        return None;
    }
    let title = String::from_utf16_lossy(&buf[..len]);
    if title.is_empty() {
        None
    } else {
        Some(title)
    }
}

// ─── Callback pour les fenêtres enfants ──────────────────────────────────────

extern "system" fn enum_children_callback(hwnd: HWND, lparam: LPARAM) -> BOOL {
    let list = unsafe { &mut *(lparam.0 as *mut Vec<String>) };
    if let Some(title) = get_hwnd_title(hwnd) {
        // On ne garde que les titres qui ont une chance d'être un plugin
        if title.len() >= 3 && title.len() < 200 {
            list.push(title);
        }
    }
    BOOL(1)
}

// ─── Callback pour les fenêtres de haut niveau ───────────────────────────────

extern "system" fn enum_windows_callback(hwnd: HWND, lparam: LPARAM) -> BOOL {
    let list = unsafe { &mut *(lparam.0 as *mut Vec<String>) };

    unsafe {
        if !IsWindowVisible(hwnd).as_bool() {
            return BOOL(1);
        }
    }

    if let Some(title) = get_hwnd_title(hwnd) {
        let lower = title.to_lowercase();

        // Hôtes DAW et fenêtres plugin flottantes — on scanne leurs enfants
        let is_daw_or_plugin = lower.contains("reaper")
            || lower.contains("fl studio")
            || lower.contains("ableton")
            || lower.contains("cubase")
            || lower.contains("studio one")
            || lower.contains("logic pro")
            || lower.contains("pro tools")
            || lower.contains("bitwig")
            || title.starts_with("VST3: ")
            || title.starts_with("VST: ")
            || title.starts_with("VSTi: ")
            || title.starts_with("CLAP: ")
            || title.starts_with("AU: ")
            || title.starts_with("FX: ");

        list.push(title);

        if is_daw_or_plugin {
            unsafe {
                let _ = EnumChildWindows(
                    hwnd,
                    Some(enum_children_callback),
                    LPARAM(list as *mut Vec<String> as isize),
                );
            }
        }
    }

    BOOL(1)
}

// ─── Point d'entrée public ────────────────────────────────────────────────────

pub fn get_all_window_titles() -> Vec<String> {
    let mut list: Vec<String> = Vec::new();
    unsafe {
        let _ = EnumWindows(
            Some(enum_windows_callback),
            LPARAM(&mut list as *mut Vec<String> as isize),
        );
    }
    // Dédoublonner (même titre peut venir de top-level + child)
    list.sort_unstable();
    list.dedup();
    list
}
