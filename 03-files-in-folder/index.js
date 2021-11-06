const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, 'secret-folder');
const fsPromises = require('fs/promises');


const findFiles = (route) => {
  fs.readdir(route, { encoding: 'utf-8', withFileTypes: true }, async (err, files) => {
    for (const file of files) {
      if (!file.isDirectory()) {
        let getData = fsPromises.stat(path.join(route, file.name));
        getData.then((stats) => {
          console.log(`${file.name.split('.')[0]} - ${file.name.split('.')[1]} - ${stats.size}b`)
        });
      }
    }
  });
}

findFiles(filePath);

