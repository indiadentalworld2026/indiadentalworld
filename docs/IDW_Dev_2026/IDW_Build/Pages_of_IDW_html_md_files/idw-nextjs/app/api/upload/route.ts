/**
 * app/api/upload/route.ts
 *
 * Image upload endpoint for clinic photos.
 * Validates dimensions + aspect ratio, compresses via sharp, stores to CDN.
 *
 * POST /api/upload
 * Body: multipart/form-data
 *   file: File
 *   slot: 'hero' | 'beforeAfter' | 'doctorPhoto'
 *   clinicSlug: string
 *   consentConfirmed: 'true'  (required for beforeAfter — DPDP 2025)
 *
 * Returns: { url: string }  — the CDN URL to store in your DB
 *
 * Dependencies: sharp (npm i sharp)
 * CDN: replace uploadToCDN() stub with your S3/GCS/Cloudflare R2 call.
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { validateImageServer, IMAGE_RULES, type ImageSlot } from '@/lib/image-rules';

const VALID_SLOTS: ImageSlot[] = ['hero', 'beforeAfter', 'doctorPhoto'];
const MAX_BODY_MB = 5; // hard limit at the edge, before processing

export async function POST(req: NextRequest) {
  // ── Parse multipart form ─────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid multipart body.' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const slot = formData.get('slot') as string | null;
  const clinicSlug = formData.get('clinicSlug') as string | null;
  const consentConfirmed = formData.get('consentConfirmed') === 'true';

  // ── Basic validation ─────────────────────────────────────────────────────
  if (!file || !slot || !clinicSlug) {
    return NextResponse.json({ error: 'file, slot, and clinicSlug are required.' }, { status: 400 });
  }
  if (!VALID_SLOTS.includes(slot as ImageSlot)) {
    return NextResponse.json({ error: `slot must be one of: ${VALID_SLOTS.join(', ')}` }, { status: 400 });
  }
  if (slot === 'beforeAfter' && !consentConfirmed) {
    return NextResponse.json(
      { error: 'DPDP 2025: consentConfirmed=true is required for before/after photos.' },
      { status: 400 }
    );
  }

  // ── Size guard ───────────────────────────────────────────────────────────
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > MAX_BODY_MB) {
    return NextResponse.json(
      { error: `File too large (${fileSizeMB.toFixed(1)} MB). Maximum is ${MAX_BODY_MB} MB.` },
      { status: 413 }
    );
  }

  // ── Read buffer ──────────────────────────────────────────────────────────
  const buffer = Buffer.from(await file.arrayBuffer());

  // ── Dimension + aspect-ratio validation ──────────────────────────────────
  let meta: sharp.Metadata;
  try {
    meta = await sharp(buffer).metadata();
  } catch {
    return NextResponse.json({ error: 'Could not read image. Please upload a valid JPEG, PNG, or WebP.' }, { status: 400 });
  }

  const dimError = validateImageServer(meta.width ?? 0, meta.height ?? 0, slot as ImageSlot);
  if (dimError) {
    return NextResponse.json({ error: dimError }, { status: 422 });
  }

  // ── Compress + convert to WebP ───────────────────────────────────────────
  const rules = IMAGE_RULES[slot as ImageSlot];
  const targetWidth = rules.outputWidths[rules.outputWidths.length - 1]; // largest step

  let compressed: Buffer;
  try {
    compressed = await sharp(buffer)
      .resize(targetWidth, undefined, {
        withoutEnlargement: true, // never upscale
        fit: 'inside',
      })
      .webp({ quality: 82, effort: 4 }) // quality 82 = visually lossless for medical photos
      .toBuffer();
  } catch {
    return NextResponse.json({ error: 'Image processing failed. Please try again.' }, { status: 500 });
  }

  // ── Log compression result (remove in prod or send to your metrics) ──────
  const inputKB  = Math.round(file.size / 1024);
  const outputKB = Math.round(compressed.length / 1024);
  console.log(`[upload] ${slot}/${clinicSlug}: ${inputKB}KB → ${outputKB}KB WebP`);

  // ── Upload to CDN ────────────────────────────────────────────────────────
  const filename = `${clinicSlug}/${slot}/${Date.now()}.webp`;
  let cdnUrl: string;
  try {
    cdnUrl = await uploadToCDN(compressed, filename);
  } catch (err) {
    console.error('[upload] CDN error:', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ url: cdnUrl, sizeKB: outputKB });
}

/**
 * Replace this stub with your real CDN upload.
 *
 * AWS S3:
 *   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
 *   await s3.send(new PutObjectCommand({ Bucket, Key: filename, Body: buffer, ContentType: 'image/webp' }));
 *   return `https://${BUCKET}.s3.ap-south-1.amazonaws.com/${filename}`;
 *
 * Cloudflare R2:
 *   Same S3 SDK, different endpoint URL.
 *
 * Google Cloud Storage:
 *   import { Storage } from '@google-cloud/storage';
 *   await storage.bucket(BUCKET).file(filename).save(buffer, { contentType: 'image/webp' });
 *   return `https://storage.googleapis.com/${BUCKET}/${filename}`;
 */
async function uploadToCDN(buffer: Buffer, filename: string): Promise<string> {
  // TODO: replace with real CDN call
  console.warn('[upload] uploadToCDN is a stub — replace with S3/GCS/R2 call');
  return `https://cdn.indiadentalworld.com/${filename}`;
}
