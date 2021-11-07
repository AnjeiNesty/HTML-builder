const fsPromises = require('fs/promises');
const path = require("path");

const filesDirectory = path.join(__dirname, 'files');
const copyDirectory = path.join(__dirname, 'files-copy');

const getFilesToCopy = async () => {
  await clearCopy(copyDirectory);
  const arrayFiles = await fsPromises.readdir(filesDirectory, { encoding: 'utf-8', withFileTypes: true });
  await fsPromises.mkdir(copyDirectory);
  await Promise.all(arrayFiles.map((el) => {
    return copyFile(el.name);
  }));
}

const copyFile = (nameFile) => {
  const fileFrom = path.join(filesDirectory, nameFile);
  const fileTo = path.join(copyDirectory, nameFile);
  fsPromises.copyFile(fileFrom, fileTo)
}

const clearCopy = async (distPath) => {
  await fsPromises.rm(distPath, { force: true, recursive: true });
};

getFilesToCopy();
