// import { defineConfig, loadEnv } from 'vite';
// import vercel from 'vite-plugin-vercel';
// import react from '@vitejs/plugin-react';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, __dirname);

//   return {
//     server: {
//       port: env.VITE_PORT
//     },
//     plugins: [
//       vercel(),
//       react(),
//     ],
//     build: {
//       sourcemap: false,
//     },
//     resolve: {
//       alias: {
//         '@': path.resolve(__dirname, './src'),
//       },
//     },
//     define: {
//       'process.env': env,
//     },
//   };
// });

import { defineConfig, loadEnv } from 'vite';
import vercel from 'vite-plugin-vercel';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      port: env.VITE_PORT,
    },
    plugins: [
      vercel(),
      react(),
    ],
    build: {
      sourcemap: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
      'process.env': {},
    },
  };
});