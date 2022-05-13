const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, '../01-read-file/text.txt'), 'utf8', function(error,data){
  if(error) throw error; 
  console.log(data); 
});