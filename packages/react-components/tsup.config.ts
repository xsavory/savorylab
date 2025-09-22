import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/ui/index.ts', 'src/lib/index.ts'],
  format: ['esm'],
  dts: true,
  clean: false,
  external: ['react', 'react-dom'],
  outDir: 'dist'
})