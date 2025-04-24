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
import { CheckCheckIcon, CheckCircle2Icon, Loader2 } from "lucide-react";

interface IDialogRenameSucess {
    isOpen: boolean;
    onClickConfirm?: () => void;
    showActionToggle: (open: boolean) => void;
}

export function DialogRenameSucess({isOpen, onClickConfirm, showActionToggle}:IDialogRenameSucess) {


  return (
    <Dialog  open={isOpen} onOpenChange={showActionToggle}>
      <DialogContent className="sm:max-w-[425px] bg-slate-50">
        <DialogHeader>
          <DialogTitle>Sucesso</DialogTitle>
          <DialogDescription className="text-center p-5 text-md font-medium">
            <div className="py-5 flex items-center justify-center">
            <CheckCircle2Icon className="w-14 h-14" color="#66bb6a"/>
            </div>
          Todos os items foram renomeados com Sucesso.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={onClickConfirm} variant={'outline'}  className="bg-black text-white">
            Concluir
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
