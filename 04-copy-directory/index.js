const fs = require('fs/promises');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true })
  .then(removeOldFiles('files-copy'))
  .then(copyFiles('files', 'files-copy'));

async function removeOldFiles(dirname){
  fs.readdir(path.join(__dirname, dirname))
    .then((files) => {
      files.forEach(file => {
        fs.unlink(path.join(__dirname, dirname, file));
      });
    });
}
async function copyFiles(source, destination){
  fs.readdir(path.join(__dirname, source))
    .then((files) => {
      files.forEach(file => {
        fs.copyFile(path.join(__dirname, source, file), path.join(__dirname, destination, file), 2);
      });
    });
}

