import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../frontend/dist');
const destDir = path.join(__dirname, 'public');

// Recursive copy function
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read all files in source directory
  const files = fs.readdirSync(src);

  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

try {
  if (fs.existsSync(sourceDir)) {
    console.log(`Copying ${sourceDir} to ${destDir}...`);
    copyDir(sourceDir, destDir);
    console.log('Frontend files copied successfully!');
  } else {
    console.warn(`Source directory ${sourceDir} does not exist. Skipping copy.`);
  }
} catch (error) {
  console.error('Error copying frontend files:', error);
  process.exit(1);
}
