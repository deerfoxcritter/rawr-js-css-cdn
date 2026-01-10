document.addEventListener('DOMContentLoaded', function() {
    initRawrForm();
});

function initRawrForm() {
    const sourceContainer = document.getElementById('rawrOriginalFields');
    const mainCol = document.getElementById('rawr-main-col');
    const sideCol = document.getElementById('rawr-side-col');

    // Safety check: if the containers don't exist, stop to prevent errors
    if (!sourceContainer || !mainCol || !sideCol) {
        console.warn('RawrForm: Missing required container elements.');
        return;
    }

    // 1. MOVE THE FIELDS
    // We convert the children to an array so the loop doesn't break as we move them
    const fields = Array.from(sourceContainer.children);

    fields.forEach(field => {
        const fieldName = field.getAttribute('data-field-name') || '';
        const fieldHTML = field.innerHTML.toLowerCase();
        
        // LOGIC: What goes in the Main (70%) Column?
        // 1. Title
        // 2. The Editor (Content)
        // 3. The Image Upload (record_image)
        // 4. Any field with "Rating" in the label
        
        const isTitle = fieldName === 'title';
        const isEditor = fieldName === 'content';
        const isUpload = fieldName.includes('record_image') || fieldHTML.includes('type="file"');
        const isRating = fieldName.includes('rating') || fieldHTML.includes('rating') || fieldHTML.includes('content level');

        if (isTitle || isEditor || isUpload || isRating) {
            mainCol.appendChild(field);
            
            // If this is the upload field, initialize the fancy uploader
            if (isUpload) {
                initFancyUpload(field);
            }
        } else {
            // Everything else (Tags, Categories, etc.) goes to Side Column
            sideCol.appendChild(field);
        }
    });

    // 2. CLEANUP
    // Show the grid now that items are moved (prevents jumping)
    document.querySelector('.rawr-form-grid').style.opacity = '1';
}

/**
 * OPTIONAL: Converts the standard IPS file input into a nice drag-drop zone
 */
function initFancyUpload(container) {
    const fileInput = container.querySelector('input[type="file"]');
    if (!fileInput) return;

    // Create the visual wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'rawr-upload-zone';
    wrapper.innerHTML = `
        <div class="rawr-upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
        </div>
        <div class="rawr-upload-text">
            <strong>Drag & Drop Artwork</strong> or click to browse
        </div>
        <div class="rawr-upload-filename"></div>
    `;

    // Hide original input but keep it functional
    fileInput.style.opacity = '0';
    fileInput.style.position = 'absolute';
    fileInput.style.width = '100%';
    fileInput.style.height = '100%';
    fileInput.style.top = '0';
    fileInput.style.left = '0';
    fileInput.style.zIndex = '10';
    fileInput.style.cursor = 'pointer';

    // Insert wrapper and move input inside it
    container.style.position = 'relative';
    container.appendChild(wrapper);
    wrapper.appendChild(fileInput);

    // Add Event Listeners for interaction
    fileInput.addEventListener('change', function() {
        const fileNameDisplay = wrapper.querySelector('.rawr-upload-filename');
        if (this.files && this.files.length > 0) {
            fileNameDisplay.textContent = "Selected: " + this.files[0].name;
            wrapper.classList.add('has-file');
        }
    });

    // Drag effects
    ['dragenter', 'dragover'].forEach(eventName => {
        fileInput.addEventListener(eventName, () => wrapper.classList.add('is-dragging'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileInput.addEventListener(eventName, () => wrapper.classList.remove('is-dragging'), false);
    });
}
