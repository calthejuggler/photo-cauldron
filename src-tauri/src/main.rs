// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{error::Error, path::PathBuf, sync::Mutex};

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Photo {
    path: String,
    name: String,
}

impl Photo {
    pub fn new(path: String, name: String) -> Photo {
        Photo { path, name }
    }

    pub fn move_to(&mut self, dir: &PathBuf) {
        let path = PathBuf::from(dir);

        std::fs::create_dir_all(&path).unwrap();

        std::fs::rename(&self.path, &path.join(self.name.clone())).unwrap();

        self.path = path.join(self.name.clone()).to_str().unwrap().to_string();
    }
}

#[derive(Debug)]
pub struct AppState(Mutex<App>);
#[derive(Default, Debug)]
pub struct App {
    photos_dir: PathBuf,
    good_dir: PathBuf,
    bad_dir: PathBuf,
    maybe_dir: PathBuf,
    photos: Vec<Photo>,
}

impl AppState {
    pub fn set_photos(&self, photos_dir: String) {
        let mut lock = self.0.lock().unwrap();
        lock.photos_dir = PathBuf::from(photos_dir);

        let photos = std::fs::read_dir(&lock.photos_dir);

        let mut actual_photos = vec![];

        for entry in photos.unwrap() {
            if let Ok(entry) = entry {
                if entry.path().is_file() {
                    let extensions = vec!["jpg", "png", "gif", "tiff", "webp", "heic"];

                    println!("{:?}", entry.path().extension().unwrap());

                    if extensions.contains(
                        &entry
                            .path()
                            .extension()
                            .unwrap_or_default()
                            .to_str()
                            .unwrap()
                            .to_lowercase()
                            .as_str(),
                    ) {
                        let path = entry.path();
                        let name = path.file_name().unwrap().to_str().unwrap().to_string();

                        actual_photos.push(Photo::new(path.to_str().unwrap().to_string(), name));
                    }
                }
            }
        }

        lock.photos = actual_photos;
    }
    pub fn get_photo(&self, index: usize) -> Result<Photo, Box<dyn Error>> {
        if index < self.0.lock().unwrap().photos.len() {
            return Ok(self.0.lock().unwrap().photos[index].clone());
        }
        Err("Photo not found".into())
    }
    pub fn set_good_dir(&self, good_dir: String) {
        self.0.lock().unwrap().good_dir = PathBuf::from(good_dir);
    }
    pub fn get_good_dir(&self) -> PathBuf {
        self.0.lock().unwrap().good_dir.clone()
    }

    pub fn set_bad_dir(&self, bad_dir: String) {
        self.0.lock().unwrap().bad_dir = PathBuf::from(bad_dir);
    }
    pub fn get_bad_dir(&self) -> PathBuf {
        self.0.lock().unwrap().bad_dir.clone()
    }

    pub fn set_maybe_dir(&self, maybe_dir: String) {
        self.0.lock().unwrap().maybe_dir = PathBuf::from(maybe_dir);
    }
    pub fn get_maybe_dir(&self) -> PathBuf {
        self.0.lock().unwrap().maybe_dir.clone()
    }

    pub fn get_photos(&self) -> Vec<Photo> {
        self.0.lock().unwrap().photos.clone()
    }
}

fn main() {
    tauri::Builder::default()
        .manage(AppState(Default::default()))
        .invoke_handler(tauri::generate_handler![initialize, get_photos, move_to])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn initialize(
    state: tauri::State<AppState>,
    photos_dir: String,
    good_dir: String,
    bad_dir: String,
    maybe_dir: String,
) {
    state.set_photos(photos_dir);
    state.set_good_dir(good_dir);
    state.set_bad_dir(bad_dir);
    state.set_maybe_dir(maybe_dir);
}

#[tauri::command]
fn get_photos(state: tauri::State<AppState>) -> Vec<Photo> {
    state.get_photos()
}

#[tauri::command]
fn move_to(state: tauri::State<AppState>, dir_type: String, index: usize) {
    let mut sys_photo = state.get_photo(index).unwrap();

    match dir_type.as_str() {
        "good" => sys_photo.move_to(&state.get_good_dir()),
        "bad" => sys_photo.move_to(&state.get_bad_dir()),
        "maybe" => sys_photo.move_to(&state.get_maybe_dir()),
        _ => {}
    }
}
