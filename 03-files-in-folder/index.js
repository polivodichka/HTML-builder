const fs = require('fs/promises');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
  .then((data) => {
    data.forEach(file => {
      if(file.isFile()){
        let ext = path.extname(file.name).replace(/./, '');
        let name = path.basename(file.name, path.extname(file.name));
        fs.stat(path.join(__dirname, 'secret-folder', file.name)).then(fileInfo => console.log(`${name} - ${ext} - ${  (fileInfo.size / 1024).toFixed(3)}kb`));       
      }   
    });
  });



