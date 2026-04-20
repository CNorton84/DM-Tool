import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// SVG template for the icon
function createSvgContent(size) {
  const radius = size * 0.1667;
  const borderWidth = size * 0.0234;
  const fontSize = size * 0.35;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <clipPath id="roundRect">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}"/>
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" fill="#0a0a0a"/>
  <rect width="${size}" height="${size}" fill="none" stroke="#cd7f32" stroke-width="${borderWidth}" clip-path="url(#roundRect)"/>
  <text x="${size/2}" y="${size/2 + size*0.05}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#cd7f32" text-anchor="middle" dominant-baseline="middle">DM</text>
</svg>`;
}

async function generateIcon(size, outputPath) {
  const svgContent = createSvgContent(size);
  await sharp(Buffer.from(svgContent))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  console.log(`Created icon-${size}.png (${size}x${size})`);
}

async function main() {
  const outputDir = path.resolve('public');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await generateIcon(192, path.join(outputDir, 'icon-192.png'));
  await generateIcon(512, path.join(outputDir, 'icon-512.png'));
  
  console.log('Icon generation complete!');
}

main().catch(console.error);