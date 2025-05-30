import os
from PIL import Image
import argparse

def convert_png_to_webp(source_dir, target_dir, quality=80, force=False):
    """
    Convert all PNG files in source_dir to WebP files in target_dir with specified quality
    
    Args:
        source_dir (str): Directory containing PNG files
        target_dir (str): Directory to save WebP files
        quality (int): WebP quality (0-100, lower = more compression)
        force (bool): Whether to force conversion even if file already exists
    """
    # Create target directory if it doesn't exist
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        print(f"Created target directory: {target_dir}")
    
    # Get all files in the source directory
    files = os.listdir(source_dir)
    png_files = [f for f in files if (f.lower().endswith('.png') or f.lower().endswith('.jpg'))]
    
    print(f"Found {len(png_files)} PNG files in {source_dir}")
    
    # Counters to track progress
    converted_count = 0
    skipped_count = 0
    error_count = 0
    
    # Process each PNG file
    for i, png_file in enumerate(png_files):
        try:
            source_path = os.path.join(source_dir, png_file)
            webp_file = os.path.splitext(png_file)[0] + '.webp'
            target_path = os.path.join(target_dir, webp_file)
            
            # Skip if WebP file already exists and force is False
            if not force and os.path.exists(target_path):
                print(f"[{i+1}/{len(png_files)}] Skipped (already exists): {png_file}")
                skipped_count += 1
                continue
            
            # Open image
            image = Image.open(source_path)
            
            # WebP supports transparency, so no need to convert RGBA to RGB
            # But we'll convert other modes if needed
            if image.mode not in ('RGBA', 'RGB'):
                image = image.convert('RGBA' if image.mode == 'LA' else 'RGB')
            
            # Save as WebP with compression
            image.save(target_path, 'WEBP', quality=quality, method=6)
            
            print(f"[{i+1}/{len(png_files)}] Converted: {png_file} → {webp_file}")
            converted_count += 1
            
        except Exception as e:
            print(f"Error converting {png_file}: {e}")
            error_count += 1
    
    print(f"Conversion complete! {converted_count} files converted, {skipped_count} files skipped, {error_count} errors.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Convert PNG images to compressed WebP')
    parser.add_argument('--source', '-s', required=True, help='Source directory containing PNG files')
    parser.add_argument('--target', '-t', required=True, help='Target directory to save WebP files')
    parser.add_argument('--quality', '-q', type=int, default=80, help='WebP quality (0-100, default: 80)')
    parser.add_argument('--force', '-f', action='store_true', help='Force conversion even if WebP file already exists')
    
    args = parser.parse_args()
    
    convert_png_to_webp(args.source, args.target, args.quality, args.force)