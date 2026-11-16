import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config with React and TypeScript support
export default defineConfig({
  plugins: [react()],
  // Enable server port auto; not needed for OBS
  server: {
    open: true,
  },
  // Build settings for a static single‑page widget
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Preserve the entry point for the OBS widget route
      input: {
        widget: './index.html',
        settings: './settings.html',
      },
    },
  },
})