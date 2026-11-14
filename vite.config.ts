import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

function copyDirRecursive(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, {recursive: true});
  for (const entry of fs.readdirSync(src, {withFileTypes: true})) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyClinicStaticAssets() {
  return {
    name: 'copy-clinic-static-assets',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      copyDirRecursive(path.resolve(__dirname, 'images'), path.join(distDir, 'images'));
      copyDirRecursive(path.resolve(__dirname, 'js'), path.join(distDir, 'js'));
      copyDirRecursive(path.resolve(__dirname, 'css'), path.join(distDir, 'css'));
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [copyClinicStaticAssets()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          services: path.resolve(__dirname, 'services.html'),
          treatments: path.resolve(__dirname, 'treatments.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          faq: path.resolve(__dirname, 'faq.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
