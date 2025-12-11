document.addEventListener('DOMContentLoaded', () => {
  const sound = document.getElementById('click-sound');
  
  // 1. Find the original favicon image element on the page
  const originalFavicon = document.querySelector('img[src*="favicon.png"]');

  if (originalFavicon && sound) {
    // 2. Create the new <button> element
    const button = document.createElement('button');
    button.id = 'favicon-button';
    button.setAttribute('aria-label', 'Play Sound');

    // 3. Move the original image INSIDE the new button
    button.appendChild(originalFavicon);

    // 4. Find the original image's parent and replace the image with the button
    const parent = originalFavicon.parentNode;
    if (parent) {
      parent.insertBefore(button, originalFavicon.nextSibling); 
    }
    
    // 5. Add necessary CSS (same as before)
    const style = document.createElement('style');
    style.innerHTML = `
      #favicon-button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        display: inline-block;
      }
      #favicon-button img {
        display: block;
      }
    `;
    document.head.appendChild(style);

    // 6. Play the sound on click (same as before)
    button.addEventListener('click', () => {
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.warn('Audio playback failed (may be blocked):', error);
      });
    });
  }
});