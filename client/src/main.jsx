import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { windowProvider as WindowProvider } from "./Context/WindowsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <WindowProvider>
        <App />
      </WindowProvider>
    </NextUIProvider>
  </StrictMode>
);
