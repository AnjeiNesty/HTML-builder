const fs = require("fs");
const path = require("path");
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const EOL = require("os").EOL;

const helloText = "Здравствуйте! Введите текст...";
const byeText = "До свидания!";
const filePath = path.join(__dirname, 'newTextFile.txt');

const rl = readline.createInterface({ input, output });

const addText = (value) => {
  fs.appendFile(filePath, value, (err) => {
    if (err) throw err;
  });
}

const exit = () => {
  console.log(`${EOL}${byeText}`);
  rl.pause();
}

fs.open(filePath, 'w', (err) => {
  if (err) throw err;
  console.log(`${EOL}${helloText}`);
});

rl.on('line', (value) => {
  if (value.toString().trim() === 'exit') {
    exit();
  }
  addText(value);
});

rl.on('SIGINT', () => exit());




