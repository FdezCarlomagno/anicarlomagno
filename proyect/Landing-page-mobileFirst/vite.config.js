import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const SRC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src')
const OPT_DIR = path.join(SRC_DIR, 'optimized')

// Si existe una copia liviana en src/optimized/<misma ruta>, el import de la imagen original
// se redirige a esa copia. Los originales quedan intactos (se generan con scripts/optimize-images.py).
const optimizedImages = () => ({
  name: 'optimized-images',
  enforce: 'pre',
  resolveId(source, importer) {
    if (!importer || !/\.(jpe?g)$/i.test(source)) return null
    const clean = importer.split('?')[0]
    const abs = path.resolve(path.dirname(clean), source)
    if (!abs.startsWith(SRC_DIR) || abs.startsWith(OPT_DIR)) return null
    const mirror = path.join(OPT_DIR, path.relative(SRC_DIR, abs))
    return fs.existsSync(mirror) ? mirror : null
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizedImages(), react()],
  server: {
    // Configuración para manejar las rutas
    historyApiFallback: true,
  },
})
