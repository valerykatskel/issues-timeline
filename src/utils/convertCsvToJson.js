const fs = require("fs");
const path = require("path");

function convertCsvToJson(csvFilePath) {
  const csvData = fs.readFileSync(csvFilePath, "utf8");
  const lines = csvData.split("\n");
  const headers = lines[0].split(",");

  const jsonData = lines
    .slice(1)
    .map((line) => {
      if (line.trim() === "") return null;
      const values = line.split(",");
      const entry = {};
      headers.forEach((header, index) => {
        entry[header.trim()] = values[index] ? values[index].trim() : "";
      });
      return entry;
    })
    .filter((entry) => entry !== null);

  return jsonData;
}

const sourceDir = path.join(__dirname, "../source");
const outputDir = path.join(__dirname, "../data");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const csvFiles = fs
  .readdirSync(sourceDir)
  .filter((file) => file.endsWith(".csv"));

csvFiles.forEach((csvFile) => {
  const csvFilePath = path.join(sourceDir, csvFile);
  const jsonData = convertCsvToJson(csvFilePath);

  const outputFileName = path.basename(csvFile, ".csv") + ".js";
  const outputFilePath = path.join(outputDir, outputFileName);

  fs.writeFileSync(
    outputFilePath,
    `export default ${JSON.stringify(jsonData, null, 2)};`
  );

  console.log(`Конвертация завершена. Данные сохранены в ${outputFilePath}`);
});

console.log("Все CSV-файлы успешно конвертированы.");
