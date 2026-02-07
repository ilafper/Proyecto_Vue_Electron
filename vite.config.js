// vite.config.js - CONFIGURACIÓN DEL SERVIDOR VUE
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],  // Usar Vue
  base: './',        // IMPORTANTE para Electron
  
  // Configuración de build
  build: {
    outDir: 'dist',           // Carpeta de salida
    emptyOutDir: true,        // Limpiar antes de construir
    sourcemap: true           // Para debugging
  },
  
  // Alias para imports más cortos
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')  // @ = src/
    }
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 5173,       // Puerto
    strictPort: true, // No cambiar puerto automáticamente
    hmr: true         // Hot Module Replacement (recarga automática)
  }
});