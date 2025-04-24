import React, { useState } from 'react';
import { DirEntry } from '@tauri-apps/plugin-fs';
import { Button } from '../ui/button';
import { Check, Loader2 } from 'lucide-react';

interface ICheck {
  files: DirEntry[],
  onSelectedFilesChange: (selectedFiles: DirEntry[]) => void,
  isProcessing: boolean,
  onCheck: (file: DirEntry) => void,
  onCheckAll: () => void
  onCheckAllDelete: () => void
  selectedFiles: DirEntry[]
}


const CheckboxList = ({ files, onSelectedFilesChange, isProcessing, onCheck, onCheckAll, onCheckAllDelete, selectedFiles }: ICheck) => {


  // Função para selecionar todos os arquivos
  const selecionarTodos = () => {
    
    if(onCheckAll){
      onCheckAll()
    }
  };

  // Função para desmarcar todos os arquivos
  const desmarcarTodos = () => {
    if(onCheckAllDelete){
      onCheckAllDelete()
    }
  };

  // Verificar se todos os arquivos estão selecionados
  const todosSelecionados = selectedFiles.length === files.length;

  const onSelectedFilesProcessing = (selectedFiles: DirEntry[]) =>{
    if(onSelectedFilesChange){
        onSelectedFilesChange(selectedFiles)
    }
  }

  // Passar os arquivos selecionados para o componente pai sempre que houver alteração
//   React.useEffect(() => {
//     onSelectedFilesChange(selectedFiles);
//   }, [selectedFiles, onSelectedFilesChange]);

  return (
    <div className="">

    <div className='p-1 rounded-md pb-7'>
     <Button className='items-center flex justify-center mb-4 '
     onClick={() => (todosSelecionados ? desmarcarTodos() : selecionarTodos())}
     
     >
        <input
          type="checkbox"
          checked={todosSelecionados}
          onChange={() => (todosSelecionados ? desmarcarTodos() : selecionarTodos())}
         className="h-4 w-4 accent-blue-500 mr-2 hover:cursor-pointer"
        />
        <label className='font-semibold hover:cursor-pointer'>Selecionar Todos</label>
      </Button>
      <hr className='h-1 mb-7' color='#cecece'/>

      {files.map((file) => (
        <div key={file.name} className='itens-center flex flex-row  gap-1 px-3 py-[0.5px] hover:cursor-pointer border-[1px] rounded-md my-2 border-slate-300 hover:bg-slate-300' onClick={() => onCheck(file)}>
         <div className="w-7 flex justify-center items-center mr-2 p-[6px]" >
          <input
            type="checkbox"
            checked={selectedFiles.some((item) => item.name === file.name)}
            onChange={() => onCheck(file)}
            className="h-4 w-4 accent-blue-500 hover:cursor-pointer"
          />
          </div>
            <label htmlFor="checkbox" className='hover:cursor-pointer'>{file.name}</label>
        </div>
      ))}
          </div>

          <div className="space-y-4 mt-3">
            <Button onClick={() => onSelectedFilesProcessing(selectedFiles)} disabled={selectedFiles.length <= 0} className="w-full bg-black text-white">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Processar Arquivos
                </>
              )}
            </Button>
          </div>
    </div>
  );
};

  
export default CheckboxList
