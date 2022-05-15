const fs = require('fs/promises');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.setPrompt('input> ');
readline.prompt();
readline.on('line', (line) =>{
  if (line === 'exit') {  
    readline.close();
    process.exit(1);
  }
  else{
    fs.appendFile(path.join(__dirname, 'text.txt'), line).then(readline.prompt());
  }
});

process.on('exit', (code) => {  
  console.log(`${code === 0 ? '\n' : ''}Great! See you later`);
});

