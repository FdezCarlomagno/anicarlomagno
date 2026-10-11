import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import seoPlugin from './scripts/seo-plugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), seoPlugin()],
  server: {
    // Configuración para manejar las rutas
    historyApiFallback: true,
  },
})
