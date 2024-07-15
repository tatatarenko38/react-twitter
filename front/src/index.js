import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./normalize.css";
import "./index.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />)

// <StrictMode>
//  // вмикає допоміжні інструмени react.js,які
// //виявляють наш поганий код та підказують в консолях
// </StrictMode>
//тому alert вискакував 2 рази
