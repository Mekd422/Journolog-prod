import { pb } from "@/lib/pocketbase";
import type { RecordModel } from "pocketbase";

export function getFileUrl(
  record: RecordModel,
  filename: string,
  options?: { thumb?: string }
): string {
  if (!filename || !record) return "";
  
  try {
    const url = pb.files.getURL(record, filename, options);
    return url || "";
  } catch (error) {
    console.error("Error generating file URL:", { filename, record: record.id, error });
    return "";
  }
}

/**
 * Compresses an image file client-side using Canvas.
 * Resizes the image to fit within maxWidth/maxHeight (maintaining aspect ratio),
 * and compresses it to WebP at a specified quality.
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> {
  // If not running in a browser environment or file is not an image, return original
  if (typeof window === "undefined" || !file || !file.type.startsWith("image/")) {
    return file;
  }

  // GIFs and SVGs don't compress well via canvas WebP compression; keep them original
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            // Keep original filename, but ensure extension/type matches webp compression
            const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], newName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            // Only return compressed file if it's actually smaller
            resolve(compressedFile.size < file.size ? compressedFile : file);
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => {
        resolve(file);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      resolve(file);
    };
    reader.readAsDataURL(file);
  });
}
