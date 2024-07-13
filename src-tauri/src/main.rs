// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::PathBuf, sync::Mutex};

pub struct AppState(Mutex<App>);
#[derive(Default)]
pub struct App {
    photos_dir: PathBuf,
    good_dir: PathBuf,
    bad_dir: PathBuf,
    maybe_dir: PathBuf,
}

impl AppState {
    pub fn set_photos_dir(&self, photos_dir: String) {
        self.0.lock().unwrap().photos_dir = PathBuf::from(photos_dir);
    }
    pub fn set_good_dir(&self, good_dir: String) {
        self.0.lock().unwrap().good_dir = PathBuf::from(good_dir);
    }
    pub fn set_bad_dir(&self, bad_dir: String) {
        self.0.lock().unwrap().bad_dir = PathBuf::from(bad_dir);
    }
    pub fn set_maybe_dir(&self, maybe_dir: String) {
        self.0.lock().unwrap().maybe_dir = PathBuf::from(maybe_dir);
    }

    pub fn get_photos(&self) -> Vec<String> {
        let mut photos = vec![];
        if let Ok(dir) = std::fs::read_dir(&self.0.lock().unwrap().photos_dir) {
            for entry in dir {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    if path.is_file() {
                        photos.push(path.to_str().unwrap().to_string());
                    }
                }
            }
        }

        photos
    }
}

fn main() {
    tauri::Builder::default()
        .manage(AppState(Default::default()))
        .invoke_handler(tauri::generate_handler![initialize, get_photos])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn initialize(state: tauri::State<AppState>, photos_dir: String) {
    state.set_photos_dir(photos_dir);
    // state.set_good_dir(good_dir);
    // state.set_bad_dir(bad_dir);
    // state.set_maybe_dir(maybe_dir);
}

#[tauri::command]
fn get_photos(state: tauri::State<AppState>) -> Vec<String> {
    state.get_photos()
}
