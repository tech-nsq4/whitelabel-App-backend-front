import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, 
      retry: 1,
    },
  },
});
import "./styles/global.css";
import { colorPalettes } from "./pages/Branding/branding.data";

const savedId = localStorage.getItem("brandingPalette");
if (savedId) {
  const saved = colorPalettes.find((p) => p.id === savedId);
  if (saved) {
    Object.entries(saved.vars).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val);
    });
  }
}

const rootEl = document.getElementById("root");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
