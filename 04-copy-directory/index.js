const fsPromises = require('fs/promises');
const path = require('path');

fsPromises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true })
  .then(async () => removeOldFiles('files-copy'))
  .then(async () => copyFiles('files', 'files-copy'));

async function removeOldFiles(dirname){
  await fsPromises.readdir(path.join(__dirname, dirname), { withFileTypes: true })
    .then(async (files) => {
      for await (const file of files){
        if(file.isFile()) await fsPromises.unlink(path.join(__dirname, dirname, file.name));
        else await fsPromises.rmdir(path.join(__dirname, dirname, file.name), { recursive: true, force: true });
      }
    });
}
async function copyFiles(source, destination){
  fsPromises.readdir(path.resolve(__dirname, source), { withFileTypes: true })
    .then(async (files) => {
      for await (const file of files){
        if(file.isFile()) {
          await fsPromises.copyFile(path.resolve(__dirname, source, file.name), path.resolve(__dirname, destination, file.name), 2);
        }
        else {
          await fsPromises.mkdir(path.resolve(__dirname, destination, file.name), { recursive: true });
          await copyFiles(path.resolve(__dirname, source, file.name), path.resolve(__dirname, destination, file.name));
        }
      }
    });
}

