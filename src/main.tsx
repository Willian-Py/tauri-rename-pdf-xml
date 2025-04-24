import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./_layout"; // Layout principal
import "./App.css"; 
import Tagdps from "./pages/Tagdps";


const Home = lazy(() => import("./pages/Home")); // Página inicial
const RenamePdf = lazy(() => import("./pages/RenamePdf")); // Página de renomear PDFs
const NotFound = lazy(() => import("./pages/NotFound"));


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="rename-pdf" element={<RenamePdf />} /> 
          <Route path="tag-dps" element={<Tagdps />} /> 
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);