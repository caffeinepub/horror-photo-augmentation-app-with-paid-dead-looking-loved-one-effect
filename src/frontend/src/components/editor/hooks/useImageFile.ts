export interface ImageFileData {
  url: string;
  width: number;
  height: number;
  file: File;
}

export async function loadImageFile(file: File): Promise<ImageFileData> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        url,
        width: img.width,
        height: img.height,
        file,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
