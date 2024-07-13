// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::PathBuf, sync::Mutex};

pub struct AppState(Mutex<App>);
#[derive(Default)]
pub struct App {
    good_dir: PathBuf,
    bad_dir: PathBuf,
    maybe_dir: PathBuf,
}

impl AppState {
    pub fn set_good_dir(&self, good_dir: String) {
        self.0.lock().unwrap().good_dir = PathBuf::from(good_dir);
    }
    pub fn set_bad_dir(&self, bad_dir: String) {
        self.0.lock().unwrap().bad_dir = PathBuf::from(bad_dir);
    }
    pub fn set_maybe_dir(&self, maybe_dir: String) {
        self.0.lock().unwrap().maybe_dir = PathBuf::from(maybe_dir);
    }
}

fn main() {
    tauri::Builder::default()
        .manage(AppState(Default::default()))
        .invoke_handler(tauri::generate_handler![initialize])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn initialize(state: tauri::State<AppState>, good_dir: String, bad_dir: String, maybe_dir: String) {
    state.set_good_dir(good_dir);
    state.set_bad_dir(bad_dir);
    state.set_maybe_dir(maybe_dir);
}
