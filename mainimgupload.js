document.addEventListener('DOMContentLoaded', function() {
    // Wait slightly to ensure IPS editor loads
    setTimeout(initRawrForm, 100);
});

function initRawrForm() {
    const sourceContainer = document.getElementById('rawrOriginalFields');
    const mainCol = document.getElementById('rawr-main-col');
    const sideCol = document.getElementById('rawr-side-col');

    if (!sourceContainer || !mainCol || !sideCol) {
        console.warn('RawrForm: Ghost container or Grid columns missing.');
        return;
    }

    const fields = Array.from(sourceContainer.children);

    fields.forEach(field => {
        // Get identifier data
        const fieldName = (field.getAttribute('data-field-name') || '').toLowerCase();
        const labelText = (field.innerText || '').toLowerCase();
        const innerHTML = field.innerHTML.toLowerCase();

        // --- SORTING LOGIC ---
        
        // 1. Is it the Title? (Usually 'title' or has id 'content_field_16' in your HTML)
        const isTitle = fieldName.includes('title') || fieldName.includes('field_16');

        // 2. Is it the Editor? (Usually 'content' or 'field_17')
        const isEditor = fieldName === 'content' || fieldName.includes('field_17');

        // 3. Is it the Main Image? (Look for file input or 'field_29')
        const isUpload = fieldName.includes('record_image') || fieldName.includes('field_29');

        // 4. Is it a Content Rating field?
        const isRating = labelText.includes('rating') || labelText.includes('content level');

        // DECISION:
        if (isTitle || isEditor || isUpload || isRating) {
            mainCol.appendChild(field);
            
            // Apply Drag & Drop styling if it is an upload field
            if (isUpload) {
                initFancyUpload(field);
            }
        } else {
            // Everything else (Tags, Fursonas, Artist, Auto-Follow, etc.)
            sideCol.appendChild(field);
        }
    });

    // Reveal the grid
    document.querySelector('.rawr-form-grid').style.opacity = '1';
}

function initFancyUpload(container) {
    // Look for the IPS uploader container or a standard file input
    const ipsUploader = container.querySelector('.ipsUploader');
    const fileInput = container.querySelector('input[type="file"]');

    if (ipsUploader) {
        // If it's an IPS uploader, we style the dropzone div
        const dropZone = ipsUploader.querySelector('.ipsAttachment_dropZone');
        if (dropZone) {
            dropZone.classList.add('rawr-upload-zone');
            // Insert custom icon if you want, or rely on CSS
        }
    } else if (fileInput) {
        // Standard file input fallback
        const wrapper = document.createElement('div');
        wrapper.className = 'rawr-upload-zone';
        wrapper.innerHTML = `
            <div class="rawr-upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <div class="rawr-upload-text"><strong>Drag & Drop Artwork</strong><br>or click to browse</div>
        `;
        fileInput.parentNode.insertBefore(wrapper, fileInput);
        wrapper.appendChild(fileInput);
        
        // Make input cover the div
        fileInput.style.position = 'absolute';
        fileInput.style.top = '0';
        fileInput.style.left = '0';
        fileInput.style.width = '100%';
        fileInput.style.height = '100%';
        fileInput.style.opacity = '0';
        fileInput.style.cursor = 'pointer';
    }
}
