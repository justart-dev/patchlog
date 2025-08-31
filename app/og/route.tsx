import { NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const imagePath = join(process.cwd(), 'public', 'images', 'thumbnail.png');
    const imageBuffer = readFileSync(imagePath);
    
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response('Image not found', { status: 404 });
  }
}
