const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require("path");

const srcStyles = path.resolve(__dirname, 'styles');
const srcBundle = path.resolve(__dirname, 'project-dist', 'bundle.css');

const clearBundle = async (distPath) => {
  await fsPromises.rm(distPath, { force: true, recursive: true });
};

const createBundleCss = async () => {
  clearBundle(srcBundle);
  const files = await getStyles();
  files.forEach((file) => {
    readStyles(file);
  });
}

const getStyles = async () => {
  let arrayNames = await fsPromises.readdir(srcStyles, { encoding: 'utf-8', withFileTypes: true });
  arrayNames = arrayNames.filter((el) => el.isFile() && el.name.split('.')[1] === 'css');
  return arrayNames;
}

const readStyles = async (file) => {
  let rStream = fs.createReadStream(path.join(srcStyles, file.name));
  rStream.addListener('data', (data) => {
    fs.open(srcBundle, 'w', (err) => {
      if (err) throw err;
    });
    fs.appendFile(srcBundle, data, (err) => {
      if (err) throw err;
    });
  });
}

createBundleCss();