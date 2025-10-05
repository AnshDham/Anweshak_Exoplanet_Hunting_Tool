import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    allowedHosts: [
      'fernanda-colloquial-semiallegorically.ngrok-free.dev',
      '.ngrok-free.dev', // This allows any ngrok subdomain
      'localhost',
      '127.0.0.1'
    ]
  }
})
