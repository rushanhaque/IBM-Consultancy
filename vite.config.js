import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // honour a port handed in by the environment (preview tools, hosting), else default
  server: { port: Number(process.env.PORT) || 5173 },
  preview: { port: Number(process.env.PORT) || 4173 },
  build: {
    // Android 7+/Chrome 64+/Safari 12+: modern syntax, smaller output
    target: 'es2019',
    // stable vendor chunks stay cached across content updates
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/](gsap|@gsap|lenis)[\\/]/.test(id)) return 'motion'
          if (/[\\/](react|react-dom|react-router|react-router-dom|@remix-run|scheduler)[\\/]/.test(id)) return 'react'
        },
      },
    },
  },
})
