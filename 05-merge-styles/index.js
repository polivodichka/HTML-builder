const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

let writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

const styleFolderName = 'styles';

fsPromises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '').then(() => {
  // читаем файлы из styles
  fsPromises.readdir(path.join(__dirname, styleFolderName), { withFileTypes: true })
    .then((files) => {
      files.forEach(file => {
        //если файл стилей
        if (file.isFile() && path.extname(file.name) === '.css') {
          let readableStream = fs.createReadStream(path.join(__dirname, styleFolderName, file.name), 'utf8');
          //получаем содержимое
          readableStream.on('data', (text) => {
            //и записываем
            writeableStream.write(text + '\n');
          });
        }
      });
    });
});

process.on('exit', () => {
  console.log('Successful!');
});





