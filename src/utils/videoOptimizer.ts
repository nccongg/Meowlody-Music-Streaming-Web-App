export const optimizeVideo = (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create a video element to check video properties
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      // Get video dimensions
      const width = video.videoWidth;
      const height = video.videoHeight;

      // If video is larger than 1080p, we should resize it
      const maxDimension = 1080;
      if (width > maxDimension || height > maxDimension) {
        // Calculate new dimensions while maintaining aspect ratio
        const aspectRatio = width / height;
        let newWidth = width;
        let newHeight = height;

        if (width > height) {
          newWidth = maxDimension;
          newHeight = Math.round(maxDimension / aspectRatio);
        } else {
          newHeight = maxDimension;
          newWidth = Math.round(maxDimension * aspectRatio);
        }

        // Create a canvas to resize the video
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');

        // Draw the first frame
        if (ctx) {
          ctx.drawImage(video, 0, 0, newWidth, newHeight);
          // Convert to base64 with reduced quality
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(videoUrl);
        }
      } else {
        resolve(videoUrl);
      }
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };

    video.src = videoUrl;
  });
};
