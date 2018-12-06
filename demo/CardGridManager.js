const clickEventName = typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown';

export class CardGridManager{
  constructor(gridElement){
    this.gridElement = gridElement;
    this.childlen = new Map();
    this.snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
    this.initAllDownload();
  }
  initAllDownload(){
    const button = document.getElementById('downloadAll');
    button.addEventListener(clickEventName, () => {
      if(this.childlen.size <= 0){
        this.snackbar.show({message:'Drop!!', actionText:'CLOSE', actionHandler:() => {}});
        return;
      }
      const zip = new JSZip();
      const folder = zip.folder("9-slicer");
      const reg=/(.*)(?:\.([^.]+$))/;
      this.childlen.forEach((slicedData, fileName) => {
        const name = fileName.match(reg)[1];
        folder.file(`${name}.json`, JSON.stringify(slicedData.params));
        folder.file(`${name}.png`, slicedData.buffer);
      });
      zip.generateAsync({type:"blob"}).then(function (blob) { saveAs(blob, "9-slicer.zip");});
    });
  }
  addCard(name, sliceData){
    if(this.childlen.has(name)) return;

    this.childlen.set(name, {buffer: sliceData.buffer, params: sliceData.params});
    const cell = this.makeCell(name, sliceData);
    this.gridElement.appendChild(cell);
  }

  makeCell(name, sliceData){
    const blob = new Blob([sliceData.buffer], {type:'image/png'});
    const imageUrl = URL.createObjectURL(blob);
  
    const cell = document.createElement('div');
    cell.setAttribute('class', 'mdc-layout-grid__cell');

    const card = document.createElement('div');
    card.setAttribute('class', 'mdc-card');
    cell.appendChild(card);

    const media = document.createElement('div');
    media.setAttribute('class', 'mdc-card__media mdc-card__media--square');
    media.style.backgroundColor = '#bdbdbd';
    media.style.backgroundImage = `url(${imageUrl})`;
    media.style.backgroundSize = 'contain';
    media.style['image-rendering'] = 'crisp-edges';
    card.appendChild(media);

    const mediaText = document.createElement('div');
    mediaText.setAttribute('class', 'mdc-card__media-content');
    mediaText.style.margin = '10px';
    mediaText.style.color = '#1c313a';
    media.appendChild(mediaText);

    mediaText.appendChild(this.makeText(name, 'mdc-typography--subtitle1'));
    mediaText.appendChild(this.makeText(`reduction: ${sliceData.reduction}%`));
    mediaText.appendChild(this.makeText(`width: ${sliceData.params.width}`));
    mediaText.appendChild(this.makeText(`height: ${sliceData.params.height}`));
    mediaText.appendChild(this.makeText(`top: ${sliceData.params.top}`));
    mediaText.appendChild(this.makeText(`bottom: ${sliceData.params.bottom}`));
    mediaText.appendChild(this.makeText(`left: ${sliceData.params.left}`));
    mediaText.appendChild(this.makeText(`right: ${sliceData.params.right}`));

    const actions = document.createElement('div');
    actions.setAttribute('class', 'mdc-card__actions');
    card.appendChild(actions);

    const actionButtons = document.createElement('div');
    actionButtons.setAttribute('class', 'mdc-card__action-buttons');
    actions.appendChild(actionButtons);

    const imageButton = document.createElement('a');
    const jsonButton = document.createElement('button');
    imageButton.setAttribute('class', 'mdc-button mdc-card__action mdc-card__action--button');
    jsonButton.setAttribute('class', 'mdc-button mdc-card__action mdc-card__action--button');
    imageButton.appendChild(new Text('DOWNLOAD'));
    jsonButton.appendChild(new Text('COPY JSON'));
    actionButtons.appendChild(imageButton);
    actionButtons.appendChild(jsonButton);
    mdc.ripple.MDCRipple.attachTo(imageButton);
    mdc.ripple.MDCRipple.attachTo(jsonButton);

    const actionIcons = document.createElement('div');
    actionIcons.setAttribute('class', 'mdc-card__action-icons');
    actions.appendChild(actionIcons);

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'material-icons mdc-icon-button mdc-card__action mdc-card__action--icon');
    deleteButton.appendChild(new Text('delete'));
    actionIcons.appendChild(deleteButton);

    imageButton.setAttribute('href', imageUrl);
    imageButton.setAttribute('download', `${name}`);

    jsonButton.addEventListener(clickEventName, () => {
      this.copyText(JSON.stringify(sliceData.params));
      this.snackbar.show({message:'Copied to Clipbord', actionText:'CLOSE', actionHandler:() => {}});
    });

    deleteButton.addEventListener(clickEventName, () => {
      this.gridElement.removeChild(cell);
      this.childlen.delete(name);
    });

    return cell;
  }
  makeText(text, classValue = 'mdc-typography--caption'){
    const textElement = document.createElement('div');
    textElement.setAttribute('class', classValue);
    textElement.appendChild(new Text(text));
    return textElement;
  }

  copyText(text){
    const form = document.createElement("textarea");
    form.textContent = text;
    document.body.appendChild(form);
    form.select();
    document.execCommand('copy');
    document.body.removeChild(form);
  }
}