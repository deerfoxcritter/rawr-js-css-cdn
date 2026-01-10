document.addEventListener('DOMContentLoaded', function() {
    // Run immediately
    initRawrForm();
    // Run again after short delay to catch late IPS rendering
    setTimeout(initRawrForm, 200);
});

function initRawrForm() {
    const mainCol = document.getElementById('rawr-main-col');
    const sideCol = document.getElementById('rawr-side-col');

    if (!mainCol || !sideCol) return;

    // Convert children to array to avoid live-collection issues
    const fields = Array.from(mainCol.children);

    fields.forEach(field => {
        // --- DETECTION LOGIC ---
        const fieldName = (field.getAttribute('data-field-name') || '').toLowerCase();
        const innerHTML = field.innerHTML.toLowerCase();
        const labelText = (field.innerText || '').toLowerCase();

        // 1. Is it the Title? (Usually first field, or labeled "Title")
        // Checks specific IPS field IDs usually associated with Title
        const isTitle = fieldName.includes('title') || 
                        fieldName.includes('field_16') || // Common Title ID
                        labelText.substring(0, 10).includes('title');

        // 2. Is it the Editor? (The big text box)
        const isEditor = fieldName.includes('content') || 
                         fieldName.includes('field_17') || // Common Content ID
                         innerHTML.includes('ipscomposearea_editor');

        // 3. Is it the Main Image Upload?
        const isUpload = fieldName.includes('record_image') || 
                         fieldName.includes('field_29') || // Your Main Image ID
                         (innerHTML.includes('type="file"') && !fieldName.includes('field_19')); // Exclude "Alternative Versions"

        // 4. Is it a Content Rating?
        const isRating = labelText.includes('rating') || labelText.includes('content level');

        // --- SORTING ---
        // If it is NOT one of the main items, throw it to the Sidebar
        if (!isTitle && !isEditor && !isUpload && !isRating) {
            sideCol.appendChild(field);
        }

        // --- STYLING ---
        // Add Fancy Drag & Drop to the Main Upload field
        if (isUpload) {
            initFancyUpload(field);
        }
    });
}

function initFancyUpload(container) {
    // Prevent double-initialization
    if (container.classList.contains('rawr-upload-ready')) return;
    
    const ipsUploader = container.querySelector('.ipsUploader');
    const fileInput = container.querySelector('input[type="file"]');

    if (ipsUploader) {
        const dropZone = ipsUploader.querySelector('.ipsAttachment_dropZone');
        if (dropZone) {
            dropZone.classList.add('rawr-upload-zone');
            container.classList.add('rawr-upload-ready');
        }
    } else if (fileInput) {
        // Fallback for basic inputs
        const wrapper = document.createElement('div');
        wrapper.className = 'rawr-upload-zone';
        wrapper.innerHTML = `
            <div class="rawr-upload-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></div>
            <div class="rawr-upload-text"><strong>Drag & Drop Artwork</strong><br>or click to browse</div>
        `;
        fileInput.parentNode.insertBefore(wrapper, fileInput);
        wrapper.appendChild(fileInput);
        
        fileInput.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; cursor:pointer;';
        container.classList.add('rawr-upload-ready');
    }
}
