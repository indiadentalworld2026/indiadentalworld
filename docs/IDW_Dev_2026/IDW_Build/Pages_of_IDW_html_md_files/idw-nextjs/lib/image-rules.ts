/**
 * lib/image-rules.ts
 *
 * Canonical image rules for the IDW platform.
 * Used by:
 *   - Upload API route (server-side validation before storing to CDN)
 *   - Client-side uploader (immediate feedback before upload)
 *   - Next.js <Image> components (sizes + aspect ratio hints)
 *
 * All sizes assume WebP output (Next.js image optimiser converts automatically).
 */

export const IMAGE_RULES = {
  /**
   * Clinic hero photos — the 5-slot masonry in the hero section.
   * Displayed at up to ~800×600px on desktop (main slot).
   * Shoot landscape. Portrait photos will be cropped to fill.
   */
  hero: {
    aspectRatio: '4 / 3',          // enforced via CSS on the container
    minWidth: 800,                  // px — reject anything smaller
    maxFileSizeMB: 4,               // before optimisation
    recommendedWidth: 1200,         // px — ideal upload size
    outputWidths: [400, 800, 1200], // Next.js `sizes` srcset steps
    outputFormat: 'webp',           // Next.js converts automatically
    maxOutputKB: 120,               // target after optimisation (quality: 80)
  },

  /**
   * Before/after case photos — shown side-by-side at 280×210px in cards,
   * then fullscreen in the lightbox (up to 900px wide).
   * MUST be the same crop for before and after — use a template overlay guide.
   */
  beforeAfter: {
    aspectRatio: '4 / 3',          // enforced — same as hero for consistency
    minWidth: 600,
    maxFileSizeMB: 3,
    recommendedWidth: 900,
    outputWidths: [300, 600, 900],
    outputFormat: 'webp',
    maxOutputKB: 90,
    note: 'Before and after photos must use identical framing and zoom level.',
  },

  /**
   * Doctor headshots — circular crop in team cards.
   * Shoot square (face centred). Non-square uploads are centre-cropped.
   */
  doctorPhoto: {
    aspectRatio: '1 / 1',          // square — enforced
    minWidth: 300,
    maxFileSizeMB: 2,
    recommendedWidth: 400,
    outputWidths: [180, 360],
    outputFormat: 'webp',
    maxOutputKB: 40,
  },
} as const;

export type ImageSlot = keyof typeof IMAGE_RULES;

/**
 * Client-side pre-upload validator.
 * Call this in your file <input> onChange handler before sending to the server.
 * Returns null if valid, or a human-readable error string.
 *
 * @example
 * const err = validateImageClient(file, 'beforeAfter');
 * if (err) { setError(err); return; }
 * await upload(file);
 */
export function validateImageClient(file: File, slot: ImageSlot): string | null {
  const rules = IMAGE_RULES[slot];

  // File type
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return 'Only JPEG, PNG, or WebP files are accepted.';
  }

  // File size (rough check before reading pixels)
  const sizeMB = file.size / 1024 / 1024;
  if (sizeMB > rules.maxFileSizeMB) {
    return `File is ${sizeMB.toFixed(1)} MB. Maximum is ${rules.maxFileSizeMB} MB. Please compress before uploading.`;
  }

  return null; // pass — full dimension check happens server-side
}

/**
 * Server-side dimension validator (run in your /api/upload route after multer/busboy).
 * Requires the `sharp` package (already a Next.js peer dep via image optimiser).
 *
 * @example
 * import sharp from 'sharp';
 * const meta = await sharp(buffer).metadata();
 * const err = validateImageServer(meta.width!, meta.height!, 'beforeAfter');
 * if (err) return res.status(400).json({ error: err });
 */
export function validateImageServer(
  width: number,
  height: number,
  slot: ImageSlot
): string | null {
  const rules = IMAGE_RULES[slot];

  if (width < rules.minWidth) {
    return `Image width (${width}px) is below the minimum of ${rules.minWidth}px. Please use a higher-resolution photo.`;
  }

  // Aspect ratio tolerance: ±10%
  const [rw, rh] = rules.aspectRatio.split(' / ').map(Number);
  const expectedRatio = rw / rh;
  const actualRatio = width / height;
  const tolerance = 0.10;

  if (Math.abs(actualRatio - expectedRatio) / expectedRatio > tolerance) {
    return `Photo proportions are off. Please upload a ${rules.aspectRatio} (${rw}:${rh}) image. Current: ${width}×${height}px.`;
  }

  return null;
}
