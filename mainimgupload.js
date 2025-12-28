/**
 * RAWR Record Form
 * Custom artwork submission form for rawr.ly
 */

(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		var sectionsContainer = document.getElementById('rawrSections');
		var originalFields = document.getElementById('rawrOriginalFields');
		
		if (!sectionsContainer || !originalFields) return;

		// ============================================
		// SECTION CREATION
		// ============================================
		function createSection(id, icon, title, subtitle, iconClass) {
			var section = document.createElement('section');
			section.className = 'rawrRecordForm__section';
			section.id = id;
			section.innerHTML = 
				'<div class="rawrRecordForm__sectionHeader">' +
					'<div class="rawrRecordForm__sectionIcon ' + (iconClass || '') + '">' + icon + '</div>' +
					'<div>' +
						'<h2 class="rawrRecordForm__sectionTitle">' + title + '</h2>' +
						'<p class="rawrRecordForm__sectionSubtitle">' + subtitle + '</p>' +
					'</div>' +
				'</div>' +
				'<div class="rawrRecordForm__sectionFields"></div>';
			return section;
		}

		// ============================================
		// SVG ICONS
		// ============================================
		var icons = {
			upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
			edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
			users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
			shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
			grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
		};

		// ============================================
		// CREATE SECTIONS
		// ============================================
		var sections = [
			createSection('section-artwork', icons.upload, 'Artwork', 'Upload your image or animation'),
			createSection('section-details', icons.edit, 'Details', 'Tell us about your artwork'),
			createSection('section-characters', icons.users, 'Characters Featured', 'Tag characters or fursonas in this artwork'),
			createSection('section-rating', icons.shield, 'Content Rating', 'Help us classify your content appropriately', 'rawrRecordForm__sectionIcon--warning')
		];

		sections.forEach(function(s) {
			sectionsContainer.appendChild(s);
		});

		// ============================================
		// FIELD TO SECTION MAPPING
		// ============================================
		function getTargetSection(fieldName, labelText) {
			labelText = (labelText || '').toLowerCase();
			fieldName = (fieldName || '').toLowerCase();
			
			// Artwork section
			if (labelText.includes('main image') || fieldName.includes('content_field_29')) return 'section-artwork';
			if (labelText.includes('alternative') || fieldName.includes('content_field_19')) return 'section-artwork';
			
			// Rating section
			if (labelText.includes('nsfw') || fieldName.includes('nsfw')) return 'section-rating';
			
			// Characters section
			if (labelText.includes('fursona') || labelText.includes('artist') || 
				fieldName.includes('content_field_18') || fieldName.includes('content_field_21')) {
				return 'section-characters';
			}
			
			// Default to details
			return 'section-details';
		}

		// ============================================
		// MOVE FIELDS TO SECTIONS
		// ============================================
		originalFields.querySelectorAll('.rawrField').forEach(function(fieldWrapper) {
			var fieldName = fieldWrapper.dataset.field || '';
			var labelEl = fieldWrapper.querySelector('.ipsFieldRow__label');
			var labelText = labelEl ? labelEl.textContent : '';
			var targetId = getTargetSection(fieldName, labelText);
			var targetSection = document.getElementById(targetId);
			
			if (targetSection) {
				var fieldsContainer = targetSection.querySelector('.rawrRecordForm__sectionFields');
				while (fieldWrapper.firstChild) {
					fieldsContainer.appendChild(fieldWrapper.firstChild);
				}
			}
		});

		// ============================================
		// REMOVE EMPTY SECTIONS
		// ============================================
		sections.forEach(function(section) {
			var fields = section.querySelector('.rawrRecordForm__sectionFields');
			if (fields && fields.children.length === 0) {
				section.remove();
			}
		});

		originalFields.style.display = 'none';

		// ============================================
		// FIX AUTOCOMPLETE INPUT WIDTHS
		// (IPS sets inline styles that override CSS)
		// ============================================
		function fixAutocompleteInputs() {
			document.querySelectorAll('.rawrRecordForm input[id*="_dummyInput"]').forEach(function(input) {
				input.style.setProperty('width', '100%', 'important');
				input.style.setProperty('min-width', '100%', 'important');
			});
		}

		// Run immediately
		fixAutocompleteInputs();

		// Run again after IPS initializes (may reinitialize inputs)
		setTimeout(fixAutocompleteInputs, 100);
		setTimeout(fixAutocompleteInputs, 500);
		setTimeout(fixAutocompleteInputs, 1000);
		setTimeout(fixAutocompleteInputs, 2000);

		// ============================================
		// MUTATION OBSERVER
		// Watch for IPS resetting inline width styles
		// ============================================
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
					var target = mutation.target;
					if (target.id && target.id.includes('_dummyInput')) {
						target.style.setProperty('width', '100%', 'important');
						target.style.setProperty('min-width', '100%', 'important');
					}
				}
			});
		});

		// Observe all current and future autocomplete inputs
		function observeAutocompleteInputs() {
			document.querySelectorAll('.rawrRecordForm input[id*="_dummyInput"]').forEach(function(input) {
				observer.observe(input, { attributes: true, attributeFilter: ['style'] });
			});
		}

		observeAutocompleteInputs();
		setTimeout(observeAutocompleteInputs, 500);
		setTimeout(observeAutocompleteInputs, 1500);
	});
})();
