require("dotenv").config();
const { fetchActiveIssues, fetchAllIssues } = require("./fetchJiraData");
const fs = require("fs");
const path = require("path");

const saveToJs = (data, filename) => {
  const jsContent = `export default ${JSON.stringify(data, null, 2)};`;
  fs.writeFileSync(
    path.join(__dirname, "..", "src", "data", filename),
    jsContent
  );
};

const updateLocalFiles = async () => {
  try {
    const activeIssues = await fetchActiveIssues();
    const allIssues = await fetchAllIssues();

    saveToJs(activeIssues, "issues-active.js");
    saveToJs(allIssues, "issues.js");

    console.log("Локальные файлы успешно обновлены.");
  } catch (error) {
    console.error("Ошибка при обновлении локальных файлов:", error.message);
    process.exit(1);
  }
};

updateLocalFiles();
