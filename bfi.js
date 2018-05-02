// initialize
function bfi_init() {
	let bfi = document.querySelectorAll('input[type="file"].bfi');
	let total = bfi.length;
	for (let i = 0; i < total; i++) {
		let input = bfi[i];
		let container = document.createElement('div');
		let label = '';
		input.parentElement.insertBefore(container, input);
		container.appendChild(input);
		container.classList.add('bfi-container');
		if (input.hasAttribute('multiple')) {
			input.classList.add('bfi-converted-multi');
			container.insertAdjacentHTML('beforeend', '<div class="bfi-label-selected" style="display: none;"></div>');
			label = 'Drag & Drop files here, or <span>Browse</span>';
		} else {
			input.classList.add('bfi-converted');
			label = 'Drag & Drop file here, or <span>Browse</span>';
		}
		if (!input.hasAttribute('id')) input.setAttribute('id', `bfi-${i}`);
		let id = input.getAttribute('id');
		container.insertAdjacentHTML('afterbegin', `<label class="bfi-label" for="${id}" tabindex="0">${label}</label>`);
		input.setAttribute('tabindex', -1);
	}
	document.querySelectorAll('input[type="file"].bfi').forEach(el => {
		el.classList.remove('bfi');
	});
}

var bfi_timer;

// drag files onto document
document.addEventListener('dragover', e => {
	var dt = e.dataTransfer;
	if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
		document.querySelectorAll('.bfi-container').forEach(el => {
			el.classList.add('expanded');
			clearTimeout(bfi_timer);
		});
	}
});

// stop dragging files
document.addEventListener('dragleave', e => {
	bfi_timer = setTimeout(() => {
		document.querySelectorAll('.bfi-container').forEach(el => {
			el.classList.remove('expanded');
		});
	}, 100);
});

// drop files
document.addEventListener('drop', e => {
	bfi_timer = setTimeout(() => {
		document.querySelectorAll('.bfi-container').forEach(el => {
			el.classList.remove('expanded');
		});
	}, 100);
});

// watch for file updates
document.addEventListener('change', e => {
	if (e.target.classList.contains('bfi-converted')) {
		let container = e.target.closest('.bfi-container');
		if (e.target.files.length) {
			container.querySelector('.bfi-label').style.display = 'none';
			container.querySelectorAll('.bfi-file').forEach(el => { el.remove() });
			let file = e.target.files[0].name;
			container.insertAdjacentHTML('beforeend', `<div class="bfi-file">${file}<span class="bfi-clear">Undo</span></div>`);
		} else {
			container.querySelector('.bfi-label').style.display = '';
			container.querySelectorAll('.bfi-file').forEach(el => { el.remove() });
		}
	}
	if (e.target.classList.contains('bfi-converted-multi')) {
		let container = e.target.closest('.bfi-container');
		if (e.target.files.length) {
			container.querySelector('.bfi-label').style.display = 'none';
			container.querySelector('.bfi-label-selected').style.display = '';
			container.querySelectorAll('.bfi-file').forEach(el => { el.remove() });
			let files = [];
			for (let i = 0; i < e.target.files.length; i++) {
				files.push(e.target.files[i].name);
			}
			let fileCount = '1 file';
			if (files.length > 1) fileCount = `${files.length} files`;
			container.querySelector('.bfi-label-selected').innerHTML = `${fileCount} selected. <span class="bfi-clear">Undo</span>`;
			files.forEach(file => {
				container.insertAdjacentHTML('beforeend', `<div class="bfi-file">${file}</div>`);
			});
		} else {
			container.querySelector('.bfi-label').style.display = '';
			container.querySelector('.bfi-label-selected').style.display = 'none';
			container.querySelectorAll('.bfi-file').forEach(el => { el.remove() });
		}
	}
});

// clear files on undo
document.addEventListener('click', e => {
	if (e.target.classList.contains('bfi-clear')) {
		let container = e.target.closest('.bfi-container');
		let inputs = container.querySelectorAll('.bfi-converted, .bfi-converted-multi');
		inputs.forEach(el => {
			el.value = '';
			el.dispatchEvent(new Event('change', { 'bubbles': true }));
		});
	}
});

// clear files from all bfi elements
function bfi_clear() {
	document.querySelectorAll('.bfi-converted, .bfi-converted-multi').forEach(el => {
		el.value = '';
		el.dispatchEvent(new Event('change', { 'bubbles': true }));
	});
}
