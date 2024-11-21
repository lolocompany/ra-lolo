import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './index.ts',
      name: '@lolocompany/ra-lolo',
      formats: ['es', 'cjs'],
      fileName: (format) => `ra-lolo.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-admin'],
      output: {
        globals: {
          react: 'React',
          'react-admin': 'ReactAdmin',
        },
      },
    },
  },
});