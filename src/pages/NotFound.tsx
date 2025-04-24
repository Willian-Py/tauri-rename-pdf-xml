import { Link } from "react-router-dom";


export default function NotFound() {
    return (
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold text-red-500">404</h1>
        <p className="text-xl mt-4">Página não encontrada.</p>
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 mt-6 block underline"
        >
          Voltar para a página inicial
        </Link>
      </div>
    );
  }