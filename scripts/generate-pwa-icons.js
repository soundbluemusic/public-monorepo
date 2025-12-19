#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const apps = ['context', 'permissive'];
const sizes = [192, 512];

async function generateIcons() {
  for (const app of apps) {
    const iconsDir = path.join(process.cwd(), 'apps', app, 'public', 'icons');
    const publicDir = path.join(process.cwd(), 'apps', app, 'public');

    // Generate regular icons
    for (const size of sizes) {
      const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
      const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);

      if (fs.existsSync(svgPath)) {
        const svg = fs.readFileSync(svgPath, 'utf-8');
        const resvg = new Resvg(svg, {
          fitTo: { mode: 'width', value: size },
        });
        const pngData = resvg.render();
        fs.writeFileSync(pngPath, pngData.asPng());
        console.log(`✓ Generated ${app}/icons/icon-${size}x${size}.png`);
      }
    }

    // Generate maskable icon
    const maskableSvgPath = path.join(iconsDir, 'icon-maskable-512x512.svg');
    const maskablePngPath = path.join(iconsDir, 'icon-maskable-512x512.png');

    if (fs.existsSync(maskableSvgPath)) {
      const svg = fs.readFileSync(maskableSvgPath, 'utf-8');
      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 512 },
      });
      const pngData = resvg.render();
      fs.writeFileSync(maskablePngPath, pngData.asPng());
      console.log(`✓ Generated ${app}/icons/icon-maskable-512x512.png`);
    }

    // Generate apple-touch-icon (180x180)
    const svg512Path = path.join(iconsDir, 'icon-512x512.svg');
    const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');

    if (fs.existsSync(svg512Path)) {
      const svg = fs.readFileSync(svg512Path, 'utf-8');
      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 180 },
      });
      const pngData = resvg.render();
      fs.writeFileSync(appleTouchIconPath, pngData.asPng());
      console.log(`✓ Generated ${app}/public/apple-touch-icon.png`);
    }

    // Generate favicon.ico (32x32)
    const faviconPath = path.join(publicDir, 'favicon.ico');
    if (fs.existsSync(svg512Path)) {
      const svg = fs.readFileSync(svg512Path, 'utf-8');
      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 32 },
      });
      const pngData = resvg.render();
      // Use sharp to convert PNG to ICO format (save as PNG, browsers support it)
      await sharp(pngData.asPng()).resize(32, 32).toFile(faviconPath);
      console.log(`✓ Generated ${app}/public/favicon.ico`);
    }
  }

  console.log('\n🎉 All PWA icons generated successfully!');
}

generateIcons().catch(console.error);
