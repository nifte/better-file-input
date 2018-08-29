# Better File Input
A lightweight vanilla JavaScript library that converts HTML File Inputs into user-friendly, interactive elements with minimal setup required

[![GitHub](https://img.shields.io/github/license/nifte/better-file-input.svg)](https://github.com/nifte/better-file-input/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/better-file-input.svg)](https://www.npmjs.com/package/better-file-input)

## Demo
View the live demo [here](https://nifte.github.io/better-file-input)

## Installation
### CDN (Recommended)
Add the following to the `<head>` of your document:
```html
<script src="https://unpkg.com/better-file-input"></script>
```

### Manual
1. Download `dist/bfi.js` (or `dist/bfi.min.js`)
2. Add the following to the `<head>` of your document:
```html
<script src="/path/to/bfi.js"></script>
```

### npm
1. Install better-file-input with the following command:
```
npm i better-file-input
```
2. Add the following to the `<head>` of your document:
```html
<script src="./node_modules/better-file-input/dist/bfi.js"></script>
```

## Usage
Simply add `class="bfi"` to your file inputs to automatically convert them to *better* file inputs:
```html
<input type="file" class="bfi">            <!-- Single file input -->
<input type="file" class="bfi" multiple>   <!-- Multiple file input -->
<input type="file" class="bfi" disabled>   <!-- Disabled file input -->
```

Dynamically-created file inputs will not be automatically converted - you need to call `bfi_init()` after creation to convert them:
```javascript
// Create new file input with the 'bfi' class
let newInput = document.createElement('input')
newInput.type = 'file'
newInput.classList.add('bfi')
document.body.appendChild(newInput)

// Convert newly created file input to a better file input
bfi_init()
```

You can call `bfi_clear()` to programmatically remove files from a converted file input:
```javascript
bfi_clear()                 // Clear all better file inputs
bfi_clear('#myFileInput')   // Clear the better file input with the id 'myFileInput'
```

## Customization
The `bfi_init()` function accepts one optional argument - an object containing pre-defined options to customize the look of your better file inputs:
```javascript
bfi_init({
  'containerColor': '#b8bfd8',                        // The color of the file container
  'labelColor': 'rgb(77, 79, 86)',                    // The color of the file container label
  'fileColor': 'linear-gradient(#84f189, #53b658)',   // The color of the files
  'fileNameColor': 'darkblue',                        // The color of the file names
  'fileInfoColor': 'rgba(55, 55, 55, 0.75)',          // The color of the file size info
  'dragDropBorder': '3px dotted #374f6d'              // The drag & drop border
})
```
Calling `bfi_reset()` will reset the styles to their default values