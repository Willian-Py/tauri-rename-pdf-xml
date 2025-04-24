import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Bem-vindo aos Utilitários Empresariais</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl underline">Renomeador XML</CardTitle>
            <CardDescription>Renomeie arquivos XML baseado em tags específicas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Ferramenta para processar e renomear arquivos XML em lote.</p>
          </CardContent>
          <CardFooter>
            <Button asChild> 
                    <Link to="/rename-pdf">Acessar Ferramenta</Link>
             </Button> 
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl underline">Verificados XML-DPS</CardTitle>
            <CardDescription>Consulte tags específicas</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Ferramenta para verificar se a  tag DPS existe dentro do XML</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/tag-dps">Acessar Ferramenta</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}