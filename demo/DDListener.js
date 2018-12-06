export class DDListener{
  constructor(element, listener){
    this.listener = listener;
    this.init(element);
  }

  init(element){
    element.addEventListener('drop', ev => {
      ev.preventDefault();
      this.onDropFiles(ev.dataTransfer.files);
    });
    element.addEventListener('dragover', ev => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'copy';
    });
  }

  async onDropFiles(files){
    const filesData = [];
    for(let i = 0; i < files.length; i++){
      await this.blobToBuffer(files[i]).then((arrayBuffer) => {
        filesData.push({
          name: files[i].name,
          buffer: arrayBuffer,
        });
      });
    }
    this.listener(filesData);
  }

  blobToBuffer(blob){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        reader.onload = null;
        reader.onerror = null;
        resolve(reader.result);
      }
      reader.onerror = () => {
        reader.onload = null;
        reader.onerror = null;
        reject(reader.error);
      }
      reader.readAsArrayBuffer(blob);
    });
  }
}
