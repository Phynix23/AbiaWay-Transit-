import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: isProduction ? 'terser' : 'esbuild', // Use terser only in production
      terserOptions: isProduction ? {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
        },
        format: {
          comments: false, // Remove comments
        },
        mangle: true, // Minify variable names
      } : {},
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split node_modules into separate chunks
            if (id.includes('node_modules')) {
              // React and related libraries
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-helmet-async')) {
                return 'vendor-react';
              }
              // Leaflet maps
              if (id.includes('leaflet')) {
                return 'vendor-leaflet';
              }
              // QR Code
              if (id.includes('qrcode.react')) {
                return 'vendor-qrcode';
              }
              // Lucide icons
              if (id.includes('lucide-react')) {
                return 'vendor-lucide';
              }
              // Other vendors
              return 'vendor-other';
            }
          },
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
      chunkSizeWarningLimit: 1000,
      assetsDir: 'assets',
      emptyOutDir: true, // Clean dist folder before build
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'leaflet', 'qrcode.react', 'lucide-react'],
    },
  };
});