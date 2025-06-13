import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    // Get the current working directory
    const currentDir = process.cwd();
    
    // Read the contents of the current directory
    const files = await readdir(currentDir, { withFileTypes: true });
    
    // Format the directory listing
    const directoryListing = files.map(file => {
      const type = file.isDirectory() ? 'DIR' : 'FILE';
      return `${type.padEnd(5)} ${file.name}`;
    }).join('\n');
    
    const response = `
Current Directory: ${currentDir}

Directory Contents:
==================
${directoryListing}

Hello from Vercel!
    `.trim();
    
    return new Response(response, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    
  } catch (error) {
    console.error('Error reading directory:', error);
    
    return new Response(`Error reading directory: ${error.message}\n\nHello from Vercel!`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}