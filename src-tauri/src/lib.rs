// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
extern crate directories;
use tauri::{command};
use std::fs;
use dirs;
use lopdf::Document;
use std::str;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn valid_password(password: String) -> bool {
    let senha_tratada = password.to_lowercase().replace(" ", "");
    senha_tratada == "senha123"
}


#[command]
async fn create_subdir() -> Result<(), String> {
    // Obter o diretório "Documents"
    let documents_dir = dirs::document_dir()
        .ok_or_else(|| "Não foi possível obter o diretório 'Documents' do usuário".to_string())?;

    // Construir o caminho para o subdiretório
    let sub_dir_path = documents_dir.join("file-utilities").join("rename-pdf");

    // Criar os diretórios
    fs::create_dir_all(&sub_dir_path)
        .map_err(|e| format!("Erro ao criar diretório: {}", e))?;

    Ok(())
}

// #[tauri::command]
// fn read_file() -> Response {
//   let data = std::fs::read("C:\\Users\\admin\\Documents\\files-utilities\\rename-pdf\\nfe.pdf").unwrap();
//   tauri::ipc::Response::new(data)
// }

// #[tauri::command]
// fn my_custom_command() -> Result<(), String> {
//   std::fs::File::open("C:\\Users\\admin\\Documents\\files-utilities\\rename-pdf\\nfe.pdf").map_err(|err| err.to_string())?;
//   // Return `null` on success
//   Ok(())
// }

// fn buffer() -> std::io::Result<()> {
//     let f = File::open("C:\\Users\\admin\\Documents\\files-utilities\\rename-pdf\\nfe.pdf")?;
//     let mut reader = BufReader::new(f);

//     let mut line = String::new();
//     let len = reader.read_line(&mut line)?;
//     println!("First line is {len} bytes long");
//     Ok(())
// }

// fn pdf_list() -> std::io::Result<()> {
//     let f = File::open("C:\\Users\\admin\\Documents\\files-utilities\\rename-pdf\\nfe.pdf")?;
//     let _reader = BufReader::new(f);
//     Ok(())
// }
#[tauri::command]
fn pdf_extract(name: String )-> Result<String, String> {
    let file = format!("C:\\\\Users\\\\admin\\\\Documents\\\\files-utilities\\\\rename-pdf\\\\{}", name);
    // Tenta carregar o documento PDF
    let doc = match Document::load(&file){
        Ok(document) => document,
        Err(err) => {
            // Se houver um erro ao carregar o documento, retorna o erro como String
            return Err(format!("Erro ao carregar o PDF: {}", err));
        }
    };

    // Tenta extrair o texto do documento
    match doc.extract_text(&[1]) {
        Ok(text) => {
            // Se a extração for bem-sucedida, retorna o texto como String
            Ok(text)
        }
        Err(err) => {
            // Se houver um erro na extração, retorna o erro como String
            Err(format!("Erro ao extrair o texto: {}", err))
        }
    }
}


#[tauri::command]
fn rename_file(old: String, new: String) -> Result<String, String> {

    if let Some(documents_path) = dirs::document_dir() {
        let old_file = documents_path.join("files-utilities").join("rename-pdf").join(old);
        let new_file = documents_path.join("files-utilities").join("rename-pdf").join(&new);

       // println!("{}", &old_file.display());
      //  println!("{}", &new_file.display());

        match std::fs::rename(&old_file, &new_file) {
            Ok(_) => {
                let success_message = format!("Arquivo renomeado com sucesso para: {}", new);
                println!("{}", success_message);
                Ok(success_message)
            }
            Err(err) => {
                let error_message = format!("Erro ao renomear o arquivo: {}", err);
                println!("{}", error_message);
                Err(error_message)
            }
        }
    } else {
        let error_message = "Diretório de documentos não encontrado.".to_string();
        println!("{}", error_message);
        Err(error_message)
    }
}

// fn change_file_name(path: impl AsRef<Path>, name: &str) -> PathBuf {
//     let path = path.as_ref();
//     let mut result = path.to_owned();
//     result.set_file_name(name);
//     if let Some(ext) = path.extension() {
//         result.set_extension(ext);
//     }
//     result
// }

// #[tauri::command]
// fn rename_file() {
//     let documents = dirs::document_dir();
//     let images_dir = Path::new(&documents).join("\\files-utilities\\rename-pdf");
//     let name = "nf.pdf";
//     let file = format!("C:\\Users\\admin\\Documents\\files-utilities\\rename-pdf\\{}", name);
//     let new_name = "new_file_name.pdf";
//     let file_new = format!("C:\\Users\\admin\\Documents\\files-utilities\\rename-pdf\\{}", new_name);
//     let path = file;
//     let new_path = change_file_name(path, new_name);
//     println!(images_dir);
//     assert_eq!(new_path, Path::new(&file_new));
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, valid_password, create_subdir, pdf_extract,rename_file ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

