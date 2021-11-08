const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require("path");

const assetsPath = path.join(__dirname, 'assets');
const dist = path.join(__dirname, 'project-dist');
const srcBundleCss = path.join(__dirname, 'project-dist', 'style.css');
const srcBundleHTML = path.join(__dirname, 'project-dist', 'index.html');
const srcComponents = path.join(__dirname, 'components');
let chunkPath;


const deleteDist = async () => {
  await fsPromises.rm(dist, { recursive: true, force: true });
}

const getFilesFromDir = async (dirFromPath) => {
  let arrayFiles = await fsPromises.readdir(path.join(__dirname, dirFromPath), { encoding: 'utf-8', withFileTypes: true });
  if (dirFromPath === "styles") {
    for (const item of arrayFiles) {
      await readStyles(item, dirFromPath);
    }
  } else {
    for (const item of arrayFiles) {
      await copyFile(item, dirFromPath);
    }
  }

}

const copyFile = async (nameFile, dirFromPath) => {
  if (!nameFile.isFile()) {
    chunkPath = nameFile;
    await getFilesFromDir(path.join(dirFromPath, chunkPath.name));
  } else {
    await fsPromises.mkdir(path.join(dist, dirFromPath), { recursive: true });
    const fileFrom = path.join(assetsPath, chunkPath.name, nameFile.name);;
    const fileTo = path.join(dist, dirFromPath, nameFile.name);
    await fsPromises.copyFile(fileFrom, fileTo)
  }
}

const readStyles = (file, dirFromPath) => {
  let rStream = fs.createReadStream(path.join(__dirname, dirFromPath, file.name));
  rStream.addListener('data', (data) => {
    fs.open(srcBundleCss, 'w', (err) => {
      if (err) throw err;
    });
    fs.appendFile(srcBundleCss, `\n\n${data}`, (err) => {
      if (err) throw err;
    });
  });
}

async function createHtmlBundle() {
  const getFiles = await fsPromises.readdir(srcComponents);
  const filterFiles = getFiles.filter(file => path.extname(file) === '.html');
  const rStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf8');
  rStream.on('data', async (htmlTemplate) => {
    let htmlBundle = htmlTemplate.toString();
    for (const componentName of filterFiles) {
      const componentPath = path.join(srcComponents, componentName);
      const component = await fsPromises.readFile(componentPath);
      const name = path.basename(componentName, '.html');
      htmlBundle = htmlBundle.replace(`{{${name}}}`, component);
    }
    await fsPromises.writeFile(srcBundleHTML, htmlBundle, 'utf8');
  });
}

const HTMLBuilder = async () => {
  await deleteDist();
  await fsPromises.mkdir(dist, { recursive: true });
  await getFilesFromDir("assets");
  await getFilesFromDir("styles");
  await createHtmlBundle();
}

HTMLBuilder();