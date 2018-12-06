import {slice} from './9slicer.min.js';
import {DDListener} from './DDListener.js';
import {CardGridManager} from './CardGridManager.js';

new mdc.topAppBar.MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
new mdc.ripple.MDCRipple(document.querySelector('.mdc-icon-button'));

const gridController = new CardGridManager(document.getElementById('itemGrid'));

function execSlice(file) {
  const uint8array = new Uint8Array(file.buffer);
  const result = slice(uint8array);

  gridController.addCard(file.name, result);
}

new DDListener(
  document.getElementById('dropArea'),
  files => {
    files.forEach(file => {
      execSlice(file);
    });
  }
)
