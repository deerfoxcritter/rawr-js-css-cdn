document.addEventListener('DOMContentLoaded', function() {
    initRawrForm();
});

function initRawrForm() {
    const mainCol = document.getElementById('rawr-main-col');
    const sideCol = document.getElementById('rawr-side-col');

    if (!mainCol || !sideCol) return;

    // Convert children to array
    const fields = Array.from(mainCol.children);

    // EXACT IDs found in your source code that should stay on the LEFT (70%)
    const mainColumnIDs = [
        'content_field_16', // Title
        'content_field_29', // Main Image
        'content_field_17', // Content Editor
        'title',            // Fallback for standard title
        'content'           // Fallback for standard editor
    ];

    fields.forEach(field => {
        const fieldName = field.getAttribute('data-field-name');
        
        // 1. STYLE THE UPLOAD
        // If this is the Main Image (29) or Alt Versions (19), apply styling
        if (fieldName === 'content_field_29' || fieldName === 'content_field_19') {
            initFancyUpload(field);
        }

        // 2. MOVE TO SIDEBAR
        // If the field ID is NOT in our "Main List", move it to the right
        if (!mainColumnIDs.includes(fieldName)) {
            sideCol.appendChild(field);
        }
    });
}

function initFancyUpload(container) {
    if (container.classList.contains('rawr-upload-ready')) return;

    // Check for IPS Ajax Uploader
    const ipsUploader = container.querySelector('.ipsUploader');
    const fileInput = container.querySelector('input[type="file"]');

    if (ipsUploader) {
        const dropZone = ipsUploader.querySelector('.ipsAttachment_dropZone');
        if (dropZone) {
            dropZone.classList.add('rawr-upload-zone');
            container.classList.add('rawr-upload-ready');
        }
    } else if (fileInput) {
        // Standard Input Fallback
        const wrapper = document.createElement('div');
        wrapper.className = 'rawr-upload-zone';
        wrapper.innerHTML = `
            <div class="rawr-upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <div class="rawr-upload-text"><strong>Drag & Drop</strong><br>or click to browse</div>
        `;
        fileInput.parentNode.insertBefore(wrapper, fileInput);
        wrapper.appendChild(fileInput);
        
        fileInput.style.position = 'absolute';
        fileInput.style.width = '100%';
        fileInput.style.height = '100%';
        fileInput.style.opacity = '0';
        fileInput.style.cursor = 'pointer';
        fileInput.style.top = '0';
        fileInput.style.left = '0';
        
        container.classList.add('rawr-upload-ready');
    }
}
