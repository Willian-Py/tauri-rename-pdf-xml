import { Outlet } from "react-router-dom"; // Importando o Outlet do react-router-dom
import Sidebar from "./components/sidebar/Sidebar";

export default function RootLayout() {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex h-screen bg-gray-100">
         <Sidebar/>

          <div className="flex flex-col flex-1 overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
              <Outlet /> 
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
