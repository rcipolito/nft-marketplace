import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from "./providers/query-provider";
import { CartProvider } from "./providers/cart-provider";
import { AuthProvider } from "./providers/auth-provider";
import SocketListener from "./components/socket-listener";

async function startApp() {
  if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
    const { worker } = await import("./mocks/browser");

    await worker.start();
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryProvider>
        <AuthProvider>
          <CartProvider>
            <SocketListener />
            <App />
          </CartProvider>
        </AuthProvider>
      </QueryProvider>
    </StrictMode>
  );
}

startApp();