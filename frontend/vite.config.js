import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, 'public'), // point to index.html
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'), // output to /app/dist in Docker
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'public/index.html')
    }
  },
  server: {
    host: true,
    strictPort: true,
    port: 3000
  }
})
