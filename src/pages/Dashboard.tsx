import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./../App.css";
import { exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import { confirm } from '@tauri-apps/plugin-dialog';
import { DialogCreateFolder } from "@/components/home/DialogCreateFolder";


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [password, setaPassword] = useState('');
  const [dialogCreateFolder, setDialogCreateFolder] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const folderCreate = 'files-utilities';
  const folderCreateRenamePdf = 'files-utilities/rename-pdf';

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  // async function existFolder(){
  //   const tokenExists = await exists('tauri', {
  //     baseDir: BaseDirectory.Document,
  //   });
  //   console.log(tokenExists)
  //   return tokenExists
  // }

  // useEffect(() =>{
  //   existFolder()
  // },[])


  
  useEffect(() => {
    async function verifyFolder() {
      const absolutFolder = await path.join(await path.documentDir(), folderCreate);
      const existFolder = await exists(folderCreate, { baseDir: BaseDirectory.Document });

      if (!existFolder) {
        const confirmacao = await confirm(
          `A pasta ${absolutFolder} não existe. Deseja criá-la?`,
          { title: 'Pasta Inexistente', kind: 'info' }
        );

        if (confirmacao) {
          setDialogCreateFolder(true)
           //Exibir o input de senha
           //Se a senha for válida -> criar a pasta
            //Se a senha não for válida -> não criar a pasta.
          }else{
              console.log('Criação de pasta cancelada pelo usuário')
          }

      } else {
          console.log(`Pasta ${absolutFolder} já existe.`)
      }
    }

    verifyFolder();
  }, []);

  const handleCriarPasta = async () => {
    setIsLoading(true)
    const senhaValida = await invoke('valid_password', { password });
      if (senhaValida) {
        try {
        await mkdir(folderCreate, { baseDir: BaseDirectory.Document });
        await mkdir(folderCreateRenamePdf, { baseDir: BaseDirectory.Document });
            console.log(`Pasta ${folderCreate} criada com sucesso.`);
            alert(`Pasta ${folderCreate} criada com sucesso.`)
            setTimeout(() =>{
              setDialogCreateFolder(false)
              setIsLoading(false)
            },2000)
        } catch (error) {
            console.error('Erro ao criar a pasta:', error);
        }
        }else {
           console.log('Senha inválida, criação de pasta cancelada');
           alert('Senha inválida, criação de pasta cancelada.')
          }
    }

    const handlePassword = (value: string) =>{
       setaPassword(value)
    }

  return (
    <main className="container">
      <DialogCreateFolder onChange={handlePassword} showActionToggle={setDialogCreateFolder} isOpen={dialogCreateFolder} onClickConfirm={handleCriarPasta}
      isLoading={isLoading}
      />
    <h1>Bem Vindo ao Utilitári Allu</h1>
  {/* 
      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p> */}
    </main>
  );
}

export default App;
