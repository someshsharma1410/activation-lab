import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/analyze': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: () => '/v1/messages',
        headers: {
          'anthropic-version': '2023-06-01',
        },
      },
    },
  },
})
