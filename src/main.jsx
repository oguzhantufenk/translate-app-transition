import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThreadsModal from "./App.jsx";
import "./index.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThreadsModal />
  </StrictMode>
);
