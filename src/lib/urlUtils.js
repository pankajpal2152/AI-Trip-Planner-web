export function fixThumborUrl(url) {
  if (!url || typeof url !== 'string') {
    return url;
  }

  try {
    const urlObj = new URL(url);

    // Check if the hostname is cdn.vox-cdn.com and path contains thumbor
    if (urlObj.hostname === 'cdn.vox-cdn.com' && urlObj.pathname.includes('/thumbor/')) {
      // Thumbor URL format example:
      // /thumbor/{signature}/{crop}/{resize}/{filters}/{image_path}

      // Split the pathname by '/'
      const parts = urlObj.pathname.split('/').filter(Boolean);

      // Find the index of 'thumbor'
      const thumborIndex = parts.indexOf('thumbor');
      if (thumborIndex === -1) {
        return url;
      }

      // Extract Thumbor parameters after 'thumbor'
      // Expected order: signature, crop, resize, filters, image_path...
      let signature = parts[thumborIndex + 1] || '';
      let crop = parts[thumborIndex + 2] || '';
      let resize = parts[thumborIndex + 3] || '';
      let filters = parts[thumborIndex + 4] || '';

      // If signature is missing or looks invalid, set to 'unsafe'
      if (!signature || signature === 'f-z1Y2kM_R04-8_o8V-t6uH_J4=') {
        signature = 'unsafe';
      }

      // Validate crop format: should be like '0x0:2048x1365'
      const cropRegex = /^\d+x\d+:\d+x\d+$/;
      if (crop && !cropRegex.test(crop)) {
        crop = '';
      }

      // Validate resize format: should be like '1200x800'
      const resizeRegex = /^\d+x\d+$/;
      if (resize && !resizeRegex.test(resize)) {
        resize = '';
      }

      // Validate filters format: should start with 'filters:'
      if (filters && !filters.startsWith('filters:')) {
        filters = '';
      }

      // Correct focal filter syntax if present
      if (filters && filters.startsWith('filters:focal(')) {
        // Extract the focal parameters inside parentheses
        const focalParamsMatch = filters.match(/filters:focal\(([^)]+)\)/);
        if (focalParamsMatch && focalParamsMatch[1]) {
          // Replace colon with commas in focal parameters
          const correctedParams = focalParamsMatch[1].replace(/:/g, ',');
          filters = `filters:focal(${correctedParams})`;
        }
      }

      // URL encode filters if present
      if (filters) {
        filters = encodeURIComponent(filters);
      }

      // Rebuild parts array with validated parameters
      // Keep signature always
      const newParts = parts.slice(0, thumborIndex + 1); // up to 'thumbor'
      newParts.push(signature);
      if (crop) newParts.push(crop);
      if (resize) newParts.push(resize);
      if (filters) newParts.push(filters);

      // Append remaining parts after filters (image path and others)
      const remainingPartsStart = thumborIndex + 5;
      if (parts.length > remainingPartsStart) {
        newParts.push(...parts.slice(remainingPartsStart));
      }

      // Rebuild pathname
      urlObj.pathname = '/' + newParts.join('/');

      return urlObj.toString();
    }

    return url;
  } catch {
    // If URL parsing fails, return original url
    return url;
  }
}
