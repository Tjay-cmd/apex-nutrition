// Image compression utility to reduce base64 size for Firestore storage

export const compressImage = (base64Data: string, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = base64Data;
  });
};

export const isBase64Image = (data: string): boolean => {
  return data.startsWith('data:image/');
};

export const getImageSizeInBytes = (base64Data: string): number => {
  // Remove data URL prefix to get just the base64 string
  const base64String = base64Data.split(',')[1];
  return Math.ceil((base64String.length * 3) / 4);
};

export const isImageSizeAcceptable = (base64Data: string, maxSizeBytes: number = 500000): boolean => {
  return getImageSizeInBytes(base64Data) <= maxSizeBytes;
}; 