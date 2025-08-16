import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n"; // Import i18n configuration
import App from "./App";
import { Providers } from "./providers/Providers";
import { SchematicContext } from "./contexts/SchematicCtx";


createRoot(document.getElementById("root")!).render(
  <Providers>
    <SchematicContext>
      <App />
      </SchematicContext>
      </Providers>
);
