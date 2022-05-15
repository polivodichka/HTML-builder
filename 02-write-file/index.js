const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

askFromConsole();

function askFromConsole(){
  readline.setPrompt('input> ');
  readline.prompt();
  readline.on('line', (line) =>{
    if (line === 'exit') {  
      readline.close();
      process.exit(0);
    }
    else{
      fs.appendFileSync(path.join(__dirname, 'text.txt'), line);
      readline.prompt();
    }
  });
}

readline.on('close', () => {
  console.log('\nGreat! See you later!');
});

