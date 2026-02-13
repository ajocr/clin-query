
  import { createRoot } from "react-dom/client";
  import App from "./App";
  import "./index.css";
  import "./amplify-config";

console.log('Region:', import.meta.env.VITE_AWS_REGION);
console.log('User Pool ID:', import.meta.env.VITE_COGNITO_USER_POOL_ID);
console.log('Client ID:', import.meta.env.VITE_COGNITO_CLIENT_ID);

  createRoot(document.getElementById("root")!).render(<App />);
  