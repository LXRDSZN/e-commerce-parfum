// =====================================================
// IMAGE UTILITIES
// Handle different image paths for localhost vs ngrok
// =====================================================

function getCorrectImagePath(imagePath) {
    // Check if we're on localhost vs ngrok
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
        // For localhost, use absolute path
        return imagePath.replace('../images/', '/e-commerce-proyect/images/');
    } else {
        // For ngrok or other domains, use relative path
        return imagePath;
    }
}

// Global function to fix image errors
function handleImageError(img) {
    console.log('Image failed to load:', img.src);
    
    // Try different image path
    const originalSrc = img.getAttribute('data-original-src') || img.src;
    
    if (!img.getAttribute('data-retry-attempted')) {
        img.setAttribute('data-retry-attempted', 'true');
        img.setAttribute('data-original-src', originalSrc);
        
        // Try with corrected path
        if (originalSrc.includes('../images/')) {
            img.src = originalSrc.replace('../images/', '/e-commerce-proyect/images/');
            return;
        }
    }
    
    // If all retries failed, show placeholder
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNkZWUyZTYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZjNzU3ZCI+SW1hZ2VuIE5vIERpc3BvbmlibGU8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2Yzc1N2QiPkVycm9yIGRlIGNhcmdhPC90ZXh0Pjwvc3ZnPg==';
    img.alt = 'Imagen no disponible';
    img.title = 'La imagen del producto no está disponible';
}

// Make function global
window.handleImageError = handleImageError;
window.getCorrectImagePath = getCorrectImagePath;

console.log('🖼️ Image utilities loaded!');