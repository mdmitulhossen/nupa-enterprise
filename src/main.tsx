import { ThemeProvider } from "next-themes";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
