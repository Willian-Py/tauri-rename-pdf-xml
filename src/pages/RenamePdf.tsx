import { NavLink } from "react-router";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Check, AlertTriangle, ArrowBigLeftIcon, ArrowLeftCircle, FolderOpenDot, FolderOpenDotIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BaseDirectory, DirEntry, readDir, rename, readTextFile, watch, watchImmediate } from '@tauri-apps/plugin-fs';
import * as _ from 'lodash'
import CheckboxList from "@/components/rename-pdf/checkbox";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event"; 
import { DialogRenameSucess } from "@/components/rename-pdf/DialogSucess";
import * as path from '@tauri-apps/api/path';


function RenamePdf() {

  const [folderPath, setFolderPath] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<DirEntry[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<DirEntry[]>([]);
  const [selectedAllFiles, setSelectedAllFiles] = useState<boolean>(false);

  const [xml, setXmlFiles] = useState<DirEntry[]>([]);
  const [selectedXml, setSelectedXml] = useState<DirEntry[]>([]);
  const [dialogRenameSucess, setDialogRenameSucess] = useState<boolean>(false)
  const [absolutFolder, setAbsolutFolder] = useState<string>("")
  const folderCreateRenamePdf = 'files-utilities/rename-pdf';

  async function readFiles() {
    const entries = await readDir('files-utilities/rename-pdf', { baseDir: BaseDirectory.Document });
    if (entries) {
      console.log(entries)
      const sortedEntries = entries.sort((a, b) => a.name.localeCompare(b.name));
      const filteredEntries = sortedEntries.filter(file => !file.name.startsWith('OK -'));
      setFiles(filteredEntries)
      setSelectedFiles(filteredEntries)
    }
  }

  async function readXML() {
    const entries = await readDir('files-utilities/xml-excel', { baseDir: BaseDirectory.Document });
    if (entries) {
      const sortedEntries = entries.sort((a, b) => a.name.localeCompare(b.name));
      const filteredEntries = sortedEntries.filter(file => !file.name.startsWith('OK -'));
      setXmlFiles(filteredEntries)
      setSelectedXml(filteredEntries)
    }
  }

useEffect(() =>{
async function getDirectorio(){
  const absolutFolder = await path.join(await path.documentDir(), folderCreateRenamePdf);
  console.log(absolutFolder)
  setAbsolutFolder(absolutFolder)
}
getDirectorio()
},[])


  useEffect(() => {
    readFiles()
    
    readXML()
    const setupListener = async () => {
      const unlisten = await listen('file-renamed', (event) => {
        const newFileName = event.payload;
        console.log(`Arquivo renomeado para: ${newFileName}`);
        
  
        readFiles();
      });
  
      return unlisten;
    };

    async function monitorarPasta() {
      const unlisten = await watchImmediate(
        'files-utilities/rename-pdf',
        (event) => {
          console.log('files-utilities/rename-pdf',        event.type);
          readFiles()
        },
        {
          baseDir: BaseDirectory.Document,
        }
      );
      return unlisten;
    }
  
    const unlistenPromise = setupListener();
    const stopMonitor = monitorarPasta();

    return () => {
      unlistenPromise.then(unlisten => unlisten()); 
      stopMonitor.then(unlisten => unlisten()); 
    };



  }, [])


async function handleProcess(selectedFiles: DirEntry[]) {
  setIsProcessing(true);


  for (const selectedFile of selectedFiles) {
    const fileName = `${selectedFile.name}`
    const response: string = await invoke('pdf_extract',{name: fileName});
    if(response){
      const cnpj = response.match(/(?:CNPJ|\/ CPF\/ NIF)?\s*(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{2}\d{3}\d{3}\/\d{4}-\d{2})/);
      const numeroNotaMatch = response.match(/Número da Nota (\d+)/) || response.match(/Numero da NFS-e:\s*(\d+)/) ||  response.match(/NúmerodaNFS-e\s*(\d+)/);  
      const emitente = response.match(/Nome\/ NomeEmpresarial\s*([A-Za-zÀ-ÿ\s]+)/) || response.match(/Nome \/ Nome Empresarial([A-Za-zÀ-ÿ\s]+)/) || response.match(/RECEBEMOS DA EMPRESA\s*(.*?S\.A)/);
      const nomeSeparado = emitente ? emitente[1].trim().split(/\s+/) : [];
      const nomeCompleto = nomeSeparado.join(' ');
      const valorTotal = response.match(/ValordoServiço\s*R?\$?([\d.,]+)/) || response.match(/VALOR TOTAL DA NOTA\s*R?\$?([\d.,]+)/) || response.match(/VALOR DO SERVIÇO\s*=\s*R\$\s*([\d.,]+)/i);
      const chaveDeAcesso = response.match(/ChavedeAcessodaNFS-e\s*(\d+)/) || response.match(/Código de VerificaçãoNFS\s+(\d+)/i) || response.match(/Código de Verificação\s+(\S+)/i) || response.match(/Código de VerificaçãoNFS\s+(\d+)/i);
      const dataEmissao = response.match(/Datae HoradaemissãodaNFS-e\s*([\d/: ]+)/) || response.match(/Data de Emissão\s*([\d/: ]+)/) || response.match(/Data RPS (\d{2}\.\d{2}\.\d{4})/);
  
      const body = {
        CNPJ: cnpj ? cnpj[1] : "Não encontrado",
        NFE: numeroNotaMatch ? numeroNotaMatch[1] :  'Não encontrado',
        NomeCompleto: nomeCompleto,
        ValorTotal: valorTotal ? 'R$ ' + valorTotal[1].replace('.', '').replace(',', '.') : "Não encontrado", 
        ChaveDeAcesso: chaveDeAcesso ? chaveDeAcesso[1] : "Não encontrada",
        DataEmissao: dataEmissao ? dataEmissao[1] : "Não encontrada",
      }

      function sanitizeFileName(fileName: string) {
        return fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_'); // Substitui caracteres inválidos por '_'
      }
      const name = sanitizeFileName(`OK - ${body.NomeCompleto} - ${body.NFE} - ${body.DataEmissao}.pdf`);
       console.log(name)
      // const result: any = await invoke("rename_file", {old: fileName, new: name});
      // console.log(result)
      try {
        const result: any = await invoke("rename_file", {old: fileName, new: name});
        console.log(result)
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
        readFiles()
        console.log(error)
      }
      setIsProcessing(false);
      readFiles()

    }
  }

  setIsProcessing(false);
  setDialogRenameSucess(true)
  readFiles()
  setSelectedFiles([]);
}


async function loadXmlFile(selectedXml: DirEntry[]) {
  try {
    for(const xml of selectedXml){
      const xmlContent = await readTextFile(`files-utilities/xml-excel/${xml.name}`, { baseDir: BaseDirectory.Document} );
      parseXml(xmlContent)
    }
  } catch (error) {
    console.error('Erro ao ler o arquivo XML:', error);
  }
}

function parseXml(xmlString: string) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  const jsonResult = xmlToJson(xmlDoc) as JsonObject;
  console.log('result',jsonResult)
}

type JsonObject = {
  [key: string]: string | JsonObject | JsonObject[] | undefined;
};


function xmlToJson(xml: Node): JsonObject | string {
  let obj: JsonObject = {};

  if (xml.nodeType === 1) {
    const element = xml as Element;

    if (element.attributes.length > 0) {
      obj["@attributes"] = {};
      for (let j = 0; j < element.attributes.length; j++) {
        const attribute = element.attributes.item(j)!;
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue ?? "";
      }
    }
  } else if (xml.nodeType === 3) {
    const text = (xml.nodeValue ?? "").trim();
    if (text) return text; // Retorna o texto diretamente
  }

  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;

      // Verifica se o nodeName já existe em obj
      if (typeof obj[nodeName] === "undefined") {
        const result = xmlToJson(item);
        obj[nodeName] = typeof result === "string" ? result : result; // Tipagem correta
      } else {
        if (!Array.isArray(obj[nodeName])) {
          obj[nodeName] = [obj[nodeName] as JsonObject]; // Garante que vira um array
        }

        const result = xmlToJson(item);
        (obj[nodeName] as JsonObject[]).push(
          typeof result === "string" ? { "#text": result } : result
        );
      }
    }
  }

  return obj;
}


  const toggleSelecionado = (file: DirEntry) => {
    setSelectedFiles((prev) => {
      if (prev.some((item) => item.name === file.name)) {
        // Se o arquivo já está selecionado, removê-lo
        return prev.filter((item) => item.name !== file.name);
      } else {
        // Se o arquivo não está selecionado, adicioná-lo
        return [...prev, file];
      }
    });
  };

  return (
    <div className="space-y-6">
      <DialogRenameSucess isOpen={dialogRenameSucess} onClickConfirm={() => setDialogRenameSucess(false)} showActionToggle={() => setDialogRenameSucess(false)}/>
      <NavLink to="/" className={"flex gap-2 text-black underline"}><ArrowLeftCircle/>Voltar</NavLink>
      <Card>
        <CardHeader>
          <CardTitle  className="text-1xl font-bold">Renomear Arquivos XML</CardTitle>
          <CardDescription>Renomeie arquivos XML baseado em tags específicas.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-3">
              <div>
                <p className="font-semibold">Diretório :</p>
                <div className="flex gap-3 items-center py-3">
                <FolderOpenDotIcon/>
                {absolutFolder}
                </div>
              </div>
              <h1 className="text-xl font-bold mb-4 underline">Lista de Arquivos Encontrados</h1>

              <CheckboxList 
              files={files} 
              onSelectedFilesChange={handleProcess} 
              isProcessing={isProcessing}
               onCheck={toggleSelecionado}
               onCheckAll={() => setSelectedFiles(files)}
               onCheckAllDelete={() => setSelectedFiles([])}
               selectedFiles={selectedFiles}
              />
            </div>
            {/* <div>
              <h1>XML</h1>
              
              <CheckboxList files={xml} onSelectedFilesChange={loadXmlFile} isProcessing={isProcessing}/>
            </div> */}
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {results.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Resultados:</h3>
                <ul className="list-disc pl-5 space-y-1 max-h-60 overflow-auto">
                  {results.map((result, index) => (
                    <li key={index} className="text-sm">{result}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RenamePdf

