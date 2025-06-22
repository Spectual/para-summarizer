import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create extension directory
const extensionDir = 'extension';
if (!fs.existsSync(extensionDir)) {
  fs.mkdirSync(extensionDir);
}

// Copy manifest.json
fs.copyFileSync('public/manifest.json', path.join(extensionDir, 'manifest.json'));

// Copy background script
fs.copyFileSync('public/background.js', path.join(extensionDir, 'background.js'));

// Copy built React app files
const distDir = 'dist';
if (fs.existsSync(distDir)) {
  // Copy all files from dist to extension
  const copyRecursive = (src, dest) => {
    if (fs.statSync(src).isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  copyRecursive(distDir, extensionDir);
  console.log('Copied built React app files to extension directory');
} else {
  console.log('Warning: dist directory not found. Please run "npm run build" first.');
}

// Create icons directory
const iconsDir = path.join(extensionDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Copy SVG icon
fs.copyFileSync('public/icons/icon.svg', path.join(iconsDir, 'icon.svg'));

// Create placeholder PNG files (you'll need to convert SVG to PNG manually)
const iconSizes = [16, 32, 48, 128];
iconSizes.forEach(size => {
  const pngPath = path.join(iconsDir, `icon${size}.png`);
  if (!fs.existsSync(pngPath)) {
    console.log(`Please create icon${size}.png (${size}x${size}) from icon.svg`);
  }
});

console.log('Chrome extension files created in ./extension directory');
console.log('Please convert icon.svg to PNG files for sizes: 16x16, 32x32, 48x48, 128x128');
console.log('Then load the extension in Chrome by going to chrome://extensions/ and enabling Developer mode'); 