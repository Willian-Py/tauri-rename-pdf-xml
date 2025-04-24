import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, FileText, PenTool as Tool, Settings, Menu, X } from "lucide-react";

const Sidebar = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };


  const closeSidebar = () => {
    setIsSidebarExpanded(false);
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarExpanded(true); // Expandir para telas grandes
      } else {
        setIsSidebarExpanded(false); // Colapsar para telas pequenas
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector("#sidebar");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    if (isSidebarExpanded) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarExpanded]);


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white ${
          isSidebarExpanded ? "w-56" : "w-16"
        } flex flex-col transition-all duration-300`}
      >
        {/* Menu Hambúrguer */}
        <div
          className={`text-gray-300 hover:text-white focus:outline-none bg-gray-800 ${isSidebarExpanded ? 'justify-end' : 'justify-center'}  flex p-3`}
          onClick={toggleSidebar}
        >
          {isSidebarExpanded ? <div><X className="h-6 w-6" /></div> : <Menu className="h-6 w-6" />}
        </div>

        {/* Itens do menu */}
        <nav className="flex-1 space-y-2">
          <ul>
            <li>
              <Link
                to="/"
                className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-700 rounded"
              >
                <Home className="h-5 w-5" />
                {isSidebarExpanded && <span>Início</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/rename-pdf"
                className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-700 rounded"
              >
                <FileText className="h-5 w-5" />
                {isSidebarExpanded && <span>Renomeador PDF</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/tag-dps"
                className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-700 rounded"
              >
                <Tool className="h-5 w-5" />
                {isSidebarExpanded && <span>Verificador XML-DPS</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-700 rounded"
              >
                <Settings className="h-5 w-5" />
                {isSidebarExpanded && <span>Configurações</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
