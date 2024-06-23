import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";


const App: React.FC = () => {
  return <div>React 18 Demo!!</div>;
};


const rootElement = document.getElementById("react-18-demo");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.log("Root element not found");
}