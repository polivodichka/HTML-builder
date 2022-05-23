const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});


//_______________Работа с созданием html_______________
getTemplateText()
  .then((templateText) => {
    let components = templateText.match(/{{\w*}}/g).map((component) => component.replace(/{{|}}/g, ''));
    replaceTemplates(templateText, components)
      .then((generatedText) => {
        const writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
        writeableStream.write(generatedText);
      });
  
  });

async function getTemplateText(){
  const readStream = fs.createReadStream(path.join(__dirname, 'template.html'));

  const chunks = [];
  for await (const chunk of readStream) {
    chunks.push(chunk);
  }
  
  return chunks.join('');
}

async function replaceTemplates(templateText, components){

  for await(const component of components){
    const readableStreamComponent = fs.createReadStream(path.join(__dirname, 'components', `${component}.html`), 'utf8');
    const fullComponent = [];
    for await (const chunkComponent of readableStreamComponent) {
      fullComponent.push(chunkComponent);
    }
    templateText = templateText.replace(new RegExp(`{{${component}}}`), fullComponent);
  }

  return templateText;
}

//_______________Мерж CSS_______________
mergeCSS();
function mergeCSS(){
  const writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

  fsPromises.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '').then(() => {
  // читаем файлы из styles
    try {
      fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
        .then((files) => {
          files.forEach(file => {
            //если файл стилей
            if (file.isFile() && path.extname(file.name) === '.css') {
              let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf8');
              //получаем содержимое
              readableStream.on('data', (text) => {
                //и записываем
                writeableStream.write(text + '\n');
              });
            }
          });
        });
    } catch {
      fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
        .then((files) => {
          files.forEach(file => {
            //если файл стилей
            if (file.isFile() && path.extname(file.name) === '.css') {
              let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf8');
              //получаем содержимое
              readableStream.on('data', (text) => {
                //и записываем
                writeableStream.write(text + '\n');
              });
            }
          });
        });
    }
  });
}

//_______________Перенос assets_______________
copyAssets();
function copyAssets(){
  fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true })
    .then(async () => removeOldFiles(path.join('project-dist', 'assets')))
    .then(async () => copyFiles('assets', path.join('project-dist', 'assets')));

  async function removeOldFiles(dirname){
    try {
      await fsPromises.readdir(path.join(__dirname, dirname), { withFileTypes: true })
        .then(async (files) => {
          for await (const file of files){
            if(file.isFile()) await fsPromises.unlink(path.join(__dirname, dirname, file.name));
            else await fsPromises.rm(path.join(__dirname, dirname, file.name), { recursive: true, force: true });
          }
        });
    } catch {
      await fsPromises.readdir(path.join(__dirname, dirname), { withFileTypes: true })
        .then(async (files) => {
          for await (const file of files){
            if(file.isFile()) await fsPromises.unlink(path.join(__dirname, dirname, file.name));
            else await fsPromises.rm(path.join(__dirname, dirname, file.name), { recursive: true, force: true });
          }
        });
    }
  }
  async function copyFiles(source, destination){
    try {
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
    } catch {
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
  }
}
process.on('exit', () => {
  console.log('Successfully!');
});

