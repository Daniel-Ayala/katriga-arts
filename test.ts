import { createClient } from '@libsql/client';
import fs from 'fs/promises';
import path from 'path';

// Define types based on your schema
interface Picture {
  id?: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  category: string[];
}

interface Category {
  id?: number;
  name: string;
}

// Initialize Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://your-db-url',
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function migrateGalleryToTurso() {
  try {
    console.log('Starting migration...');

    // Read JSON file
    const jsonPath = path.join(process.cwd(), 'src/data/gallery.json');
    const data = await fs.readFile(jsonPath, 'utf-8');
    const pictures: Picture[] = JSON.parse(data);

    // Keep track of categories we've already processed
    const processedCategories = new Map<string, number>();

    // Process each picture
    for (const picture of pictures) {
      console.log(`Processing picture: ${picture.alt}`);
      
      // 1. Insert the picture
      // Note: The 'picture' column is a blob in the schema, but we're storing the path
      // If you want to store the actual binary data, you'd need to read the file
      const pictureResult = await client.execute({
        sql: 'INSERT INTO Pictures (picture, alt, title, description) VALUES (?, ?, ?, ?) RETURNING id',
        args: [picture.src, picture.alt, picture.title || '', picture.description || '']
      });
      
      const pictureId = pictureResult.rows[0].id as number;
      
      // 2. Process categories
      for (const categoryName of picture.category) {
        let categoryId: number;
        
        // Check if we've already processed this category
        if (processedCategories.has(categoryName)) {
          categoryId = processedCategories.get(categoryName)!;
        } else {
          // Check if category exists in database
          const categoryCheck = await client.execute({
            sql: 'SELECT id FROM Categories WHERE name = ?',
            args: [categoryName]
          });
          
          if (categoryCheck.rows.length > 0) {
            categoryId = categoryCheck.rows[0].id as number;
          } else {
            // Insert new category
            const categoryResult = await client.execute({
              sql: 'INSERT INTO Categories (name) VALUES (?) RETURNING id',
              args: [categoryName]
            });
            categoryId = categoryResult.rows[0].id as number;
          }
          
          // Store category ID for future reference
          processedCategories.set(categoryName, categoryId);
        }
        
        // 3. Create relationship in junction table
        await client.execute({
          sql: 'INSERT INTO PicturesCategories (categoryId, pictureId) VALUES (?, ?)',
          args: [categoryId, pictureId]
        });
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

// Run migration
migrateGalleryToTurso();