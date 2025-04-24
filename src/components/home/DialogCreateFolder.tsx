import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react";

interface IDialogCreateFolder {
    onChange: (value: string) => void;
    isOpen: boolean;
    showActionToggle: (open: boolean) => void;
    onClickConfirm?: () => void;
    isLoading?: boolean
}

export function DialogCreateFolder({onChange, isOpen, showActionToggle, onClickConfirm,isLoading}:IDialogCreateFolder) {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value; // Pega o valor do input
        if (onChange) {
          onChange(value); // Chama o callback passado pela prop
        }
      };


  return (
    <Dialog  open={isOpen} onOpenChange={showActionToggle} >
      <DialogContent className="sm:max-w-[425px] bg-slate-50">
        <DialogHeader>
          <DialogTitle>Digita a senha para confirmação:</DialogTitle>
          <DialogDescription>
            Esta credencial precisa ser validada para podermos criar a pasta necessária para administrar os documentos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Senha
            </Label>
            <Input id="name" className="col-span-3"  onChange={handleChange} type="password"/>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={onClickConfirm} variant={'outline'}>
            {
              isLoading ? 
              (
                <><Loader2 className="animate-spin"/>Criando Pasta</>
              )
              :
              (
                <>Criar Pasta</>
              )
            }
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
