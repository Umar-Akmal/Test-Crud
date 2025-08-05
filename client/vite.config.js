import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    host: true,       // ⬅️ This makes Vite listen on 0.0.0.0
    port: 5173,       // ⬅️ Optional, just to be explicit
    strictPort: true  // ⬅️ Prevents fallback to a random port
  },
  watch: {
    usePolling: true,      // <-- important on Linux
    interval: 100           // check every 100ms
  }
})
