import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const ACCOUNT_ID = 'd83aa50b333865f19404fbc1cf750a99';
const ACCESS_KEY_ID = '994e5be9c6f2f4af8992ce454ea5122d';
const SECRET_ACCESS_KEY = 'cd3059fca8fd8def508541662ffc8ac3eee38cf09315f5dca8b9be97e4075f4a';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const getMimeType = (ext) => {
  const map = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.gif': 'image/gif'
  };
  return map[ext] || 'application/octet-stream';
};

const publicDir = path.resolve('public');
const imageExtensions = ['.png', '.svg', '.jpg', '.jpeg', '.webp'];

function collectImages(dir, basePath = '') {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      results.push(...collectImages(fullPath, relativePath));
    } else if (imageExtensions.includes(path.extname(entry.name).toLowerCase())) {
      if (entry.name === 'favicon.svg' || entry.name === 'favicon.ico') continue;
      results.push({ fullPath, relativePath, publicUrl: '/' + relativePath });
    }
  }
  return results;
}

const allImages = collectImages(publicDir);

async function main() {
  const bucketName = 'fampam-assets';
  for (const img of allImages) {
    const fileBuffer = fs.readFileSync(img.fullPath);
    const contentType = getMimeType(path.extname(img.relativePath).toLowerCase());
    
    console.log(`Uploading ${img.relativePath}...`);
    try {
      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: img.relativePath,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable'
      }));
      console.log(`✅ Uploaded ${img.relativePath}`);
    } catch (e) {
      console.error(`❌ Failed ${img.relativePath}:`, e.message);
    }
  }
}
main();
