const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const convertToJson = (data, outputPath) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(outputPath, jsonData);
  console.log(`Данные успешно сохранены в ${outputPath}`);
};

const processData = (inputPath, outputPath) => {
  const fileContent = fs.readFileSync(inputPath, 'utf8');
  
  if (path.extname(inputPath) === '.csv') {
    Papa.parse(fileContent, {
      header: true,
      complete: (results) => {
        convertToJson(results.data, outputPath);
      },
    });
  } else if (path.extname(inputPath) === '.json') {
    const jsonData = JSON.parse(fileContent);
    convertToJson(jsonData, outputPath);
  } else {
    console.error('Неподдерживаемый формат файла');
  }
};

const convertData = () => {
  const sourceDir = path.join(__dirname, '..', 'source');
  const dataDir = path.join(__dirname, '..', 'data');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const files = [
    { input: 'issues.csv',