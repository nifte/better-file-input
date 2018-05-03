// initialize
var bfi_counter = 0;
function bfi_init(options = null) {
	let bfi = document.querySelectorAll('input[type="file"].bfi');
	let total = bfi.length;
	for (let i = 0; i < total; i++) {
		bfi_counter++;
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
		if (!input.hasAttribute('id')) input.setAttribute('id', `bfi-${bfi_counter}`);
		let id = input.getAttribute('id');
		container.insertAdjacentHTML('afterbegin', `<label class="bfi-label" for="${id}" tabindex="0">${label}</label>`);
		container.insertAdjacentHTML('beforeend', '<div class="bfi-shadow-container"><div class="bfi-shadow"></div></div>');
		input.setAttribute('tabindex', -1);
	}
	document.querySelectorAll('input[type="file"].bfi').forEach(el => {
		el.classList.remove('bfi');
	});
	if (options != null) {
		let style = '';
		if (options.hasOwnProperty('labelColor')) style += `.bfi-label, .bfi-label-selected { color: ${options.labelColor} }`;
		if (options.hasOwnProperty('containerColor')) style += `.bfi-container { background: ${options.containerColor} }`;
		if (options.hasOwnProperty('fileColor')) style += `.bfi-file { background: ${options.fileColor} }`;
		if (options.hasOwnProperty('fileNameColor')) style += `.bfi-file { color: ${options.fileNameColor} }`;
		if (options.hasOwnProperty('fileInfoColor')) style += `.bfi-file i { color: ${options.fileInfoColor} }`;
		if (options.hasOwnProperty('dragDropBorder')) style += `.bfi-container.expanded { border: ${options.dragDropBorder} }`;
		document.body.insertAdjacentHTML('beforeend', `<style class="bfi-custom-style">${style}</style>`);
	}
}

// drag files onto page
var bfi_drag_timeout, bfi_hover_timeout;
window.addEventListener('dragover', e => {
	let dt = e.dataTransfer;
	if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
		document.querySelectorAll('.bfi-container').forEach(el => {
			if (el.querySelector('.bfi-label').style.display != 'none') el.classList.add('expanded');
		});
		clearTimeout(bfi_drag_timeout);
		bfi_drag_timeout = setTimeout(() => {
			document.querySelectorAll('.bfi-container').forEach(el => { el.classList.remove('expanded') });
		}, 100);
		document.querySelectorAll('.bfi-shadow').forEach(el => {
			el.style.left = e.pageX - 200 + 'px';
			el.style.top = e.pageY - 200 + 'px';
		});
		if (e.target.classList.contains('bfi-converted') || e.target.classList.contains('bfi-converted-multi')) {
			let container = e.target.closest('.bfi-container');
			container.classList.add('hovering');
			clearTimeout(bfi_hover_timeout);
			bfi_hover_timeout = setTimeout(() => {
				container.classList.remove('hovering');
			}, 100);
		}
	}
});

// drag files out of container
window.addEventListener('dragleave', e => {
	if (e.target.classList.contains('bfi-converted') || e.target.classList.contains('bfi-converted-multi')) {
		let container = e.target.closest('.bfi-container');
		container.classList.remove('hovering');
	}
});

// prevent browser from opening any dragged files
window.addEventListener('dragover', e => {
	if (!e.target.classList.contains('bfi-converted') && !e.target.classList.contains('bfi-converted-multi')) {
		e.preventDefault();
		e.dataTransfer.effectAllowed = "none";
		e.dataTransfer.dropEffect = "none";
	}
});

// prevent browser from opening any dropped files
window.addEventListener('drop', e => {
	if (!e.target.classList.contains('bfi-converted') && !e.target.classList.contains('bfi-converted-multi')) {
		e.preventDefault();
		e.dataTransfer.effectAllowed = "none";
		e.dataTransfer.dropEffect = "none";
	}
});

// watch for file updates
document.addEventListener('change', e => {
	if (e.target.classList.contains('bfi-converted')) {
		let container = e.target.closest('.bfi-container');
		if (e.target.files.length) {
			container.querySelector('.bfi-label').style.display = 'none';
			container.querySelectorAll('.bfi-file').forEach(el => { el.remove() });
			let file = e.target.files[0].name;
			let size = Number(e.target.files[0].size / 1000).toFixed(1) + ' KB';
			container.insertAdjacentHTML('beforeend', `<div class="bfi-file"><span class="bfi-clear">Undo</span>${file}<br><i>${size}</i></div>`);
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
				files.push({
					'name': e.target.files[i].name,
					'size': Number(e.target.files[i].size / 1000).toFixed(1) + ' KB'
				});
			}
			let fileCount = '1 file';
			if (files.length > 1) fileCount = `${files.length} files`;
			container.querySelector('.bfi-label-selected').innerHTML = `${fileCount} selected. <span class="bfi-clear">Undo</span>`;
			files.forEach(file => {
				container.insertAdjacentHTML('beforeend', `<div class="bfi-file">${file.name}<br><i>${file.size}</i></div>`);
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
		let inputID = container.querySelector('.bfi-converted, .bfi-converted-multi').getAttribute('id');
		bfi_clear(inputID);
	}
});

// clear files from all bfi elements
function bfi_clear(id = null) {
	if (id != null) {
		let el = document.querySelector(`#${id}`);
		el.value = '';
		el.dispatchEvent(new Event('change', { 'bubbles': true }));
	} else {
		document.querySelectorAll('.bfi-converted, .bfi-converted-multi').forEach(el => {
			el.value = '';
			el.dispatchEvent(new Event('change', { 'bubbles': true }));
		});
	}
}
