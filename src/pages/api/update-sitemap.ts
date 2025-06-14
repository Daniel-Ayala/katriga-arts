export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  console.log("Received request to update sitemap");
  try {
    // Use ES6 imports instead of require
    const fs = await import('fs');
    const path = await import('path');
    
    // Get current working directory
    const currentDir = process.cwd();
    
    // Read current directory contents
    const files = fs.readdirSync(currentDir);
    
    // Create detailed file listing
    const fileDetails = files.map(file => {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        type: stats.isDirectory() ? 'DIR' : 'FILE',
        size: stats.isFile() ? stats.size : null,
        modified: stats.mtime.toISOString()
      };
    });
    
    // Check for specific files we might need
    const importantFiles = [
      'sitemap.xml',
      'public/sitemap.xml',
      'dist/sitemap.xml',
      'package.json',
      'astro.config.mjs'
    ];
    
    const fileExists = {};
    for (const file of importantFiles) {
      try {
        const fullPath = path.join(currentDir, file);
        fileExists[file] = fs.existsSync(fullPath);
      } catch {
        fileExists[file] = false;
      }
    }
    
    // Build console log format response
    let logOutput = '';
    logOutput += `[${new Date().toISOString()}] Sitemap Update Check\n`;
    logOutput += `=====================================\n`;
    logOutput += `Current Directory: ${currentDir}\n`;
    logOutput += `Total Files: ${files.length}\n\n`;
    
    logOutput += `Directory Contents:\n`;
    logOutput += `-------------------\n`;
    fileDetails.forEach(file => {
      const sizeInfo = file.size !== null ? ` (${file.size} bytes)` : '';
      logOutput += `${file.type.padEnd(4)} ${file.name}${sizeInfo}\n`;
    });
    
    logOutput += `\nImportant Files Check:\n`;
    logOutput += `----------------------\n`;
    Object.entries(fileExists).forEach(([file, exists]) => {
      const status = exists ? '✓ EXISTS' : '✗ NOT FOUND';
      logOutput += `${status.padEnd(12)} ${file}\n`;
    });
    
    logOutput += `\nEnd of file listing\n`;
    console.log(logOutput);export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  try {
    // Use ES6 imports instead of require
    const fs = await import('fs');
    const path = await import('path');
    
    // Get current working directory
    const currentDir = process.cwd();
    
    // Read current directory contents
    const files = fs.readdirSync(currentDir);
    
    // Create detailed file listing
    const fileDetails = files.map(file => {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        type: stats.isDirectory() ? 'DIR' : 'FILE',
        size: stats.isFile() ? stats.size : null,
        modified: stats.mtime.toISOString()
      };
    });
    
    // Check for specific files we might need
    const importantFiles = [
      'sitemap.xml',
      'public/sitemap.xml',
      'dist/sitemap.xml',
      'package.json',
      'astro.config.mjs'
    ];
    
    const fileExists = {};
    for (const file of importantFiles) {
      try {
        const fullPath = path.join(currentDir, file);
        fileExists[file] = fs.existsSync(fullPath);
      } catch {
        fileExists[file] = false;
      }
    }
    
    // Build console log format response
    let logOutput = '';
    logOutput += `[${new Date().toISOString()}] Sitemap Update Check\n`;
    logOutput += `=====================================\n`;
    logOutput += `Current Directory: ${currentDir}\n`;
    logOutput += `Total Files: ${files.length}\n\n`;
    
    logOutput += `Directory Contents:\n`;
    logOutput += `-------------------\n`;
    fileDetails.forEach(file => {
      const sizeInfo = file.size !== null ? ` (${file.size} bytes)` : '';
      logOutput += `${file.type.padEnd(4)} ${file.name}${sizeInfo}\n`;
    });
    
    logOutput += `\nImportant Files Check:\n`;
    logOutput += `----------------------\n`;
    Object.entries(fileExists).forEach(([file, exists]) => {
      const status = exists ? '✓ EXISTS' : '✗ NOT FOUND';
      logOutput += `${status.padEnd(12)} ${file}\n`;
    });
    
    logOutput += `\nEnd of file listing\n`;
    
    return new Response(logOutput, {
      headers: { "Content-Type": "text/plain" }
    });
    
  } catch (error) {
    console.error("Error reading files:", error);
    const errorLog = `[${new Date().toISOString()}] ERROR: Failed to read files\n` +
                    `Message: ${error.message}\n` +
                    `Stack: ${error.stack || 'No stack trace available'}\n`;
    
    return new Response(errorLog, {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
};export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  try {
    // Use ES6 imports instead of require
    const fs = await import('fs');
    const path = await import('path');
    
    // Get current working directory
    const currentDir = process.cwd();
    
    // Read current directory contents
    const files = fs.readdirSync(currentDir);
    
    // Create detailed file listing
    const fileDetails = files.map(file => {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        type: stats.isDirectory() ? 'DIR' : 'FILE',
        size: stats.isFile() ? stats.size : null,
        modified: stats.mtime.toISOString()
      };
    });
    
    // Check for specific files we might need
    const importantFiles = [
      'sitemap.xml',
      'public/sitemap.xml',
      'dist/sitemap.xml',
      'package.json',
      'astro.config.mjs'
    ];
    
    const fileExists = {};
    for (const file of importantFiles) {
      try {
        const fullPath = path.join(currentDir, file);
        fileExists[file] = fs.existsSync(fullPath);
      } catch {
        fileExists[file] = false;
      }
    }
    
    // Build console log format response
    let logOutput = '';
    logOutput += `[${new Date().toISOString()}] Sitemap Update Check\n`;
    logOutput += `=====================================\n`;
    logOutput += `Current Directory: ${currentDir}\n`;
    logOutput += `Total Files: ${files.length}\n\n`;
    
    logOutput += `Directory Contents:\n`;
    logOutput += `-------------------\n`;
    fileDetails.forEach(file => {
      const sizeInfo = file.size !== null ? ` (${file.size} bytes)` : '';
      logOutput += `${file.type.padEnd(4)} ${file.name}${sizeInfo}\n`;
    });
    
    logOutput += `\nImportant Files Check:\n`;
    logOutput += `----------------------\n`;
    Object.entries(fileExists).forEach(([file, exists]) => {
      const status = exists ? '✓ EXISTS' : '✗ NOT FOUND';
      logOutput += `${status.padEnd(12)} ${file}\n`;
    });
    
    logOutput += `\nEnd of file listing\n`;
    
    return new Response(logOutput, {
      headers: { "Content-Type": "text/plain" }
    });
    
  } catch (error) {
    console.error("Error reading files:", error);
    const errorLog = `[${new Date().toISOString()}] ERROR: Failed to read files\n` +
                    `Message: ${error.message}\n` +
                    `Stack: ${error.stack || 'No stack trace available'}\n`;
    
    return new Response(errorLog, {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
};
    
    return new Response(logOutput, {
      headers: { "Content-Type": "text/plain" }
    });
    
  } catch (error) {
    console.error("Error reading files:", error);
    const errorLog = `[${new Date().toISOString()}] ERROR: Failed to read files\n` +
                    `Message: ${error.message}\n` +
                    `Stack: ${error.stack || 'No stack trace available'}\n`;
    
    return new Response(errorLog, {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
};