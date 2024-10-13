require("dotenv").config();
const axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");

const jiraHost = process.env.JIRA_HOST;
const jiraUsername = process.env.JIRA_USERNAME;
const jiraApiToken = process.env.JIRA_API_TOKEN;
const jiraJql =
  "parent = ADAF-9226 AND status != Closed ORDER BY priority DESC, status DESC, created ASC";

const csvWriter = createCsvWriter({
  path: path.join(__dirname, "../src/source/issues-autoupdate.csv"),
  header: [
    { id: "priority", title: "Priority" },
    { id: "status", title: "Status" },
    { id: "created", title: "Created" },
    { id: "resolved", title: "Resolved" },
  ],
});

async function fetchJiraTasks() {
  try {
    const response = await axios.get(`${jiraHost}/rest/api/2/search`, {
      params: {
        jql: jiraJql,
        maxResults: 1000,
        fields: "priority,status,created,resolved",
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${jiraUsername}:${jiraApiToken}`
        ).toString("base64")}`,
        Accept: "application/json",
      },
    });

    return response.data.issues.map((issue) => ({
      priority: issue.fields.priority.name,
      status: issue.fields.status.name,
      created: new Date(issue.fields.created).toLocaleString("ru-RU"),
      resolved: issue.fields.resolutiondate
        ? new Date(issue.fields.resolutiondate).toLocaleString("ru-RU")
        : "",
    }));
  } catch (error) {
    console.error("Ошибка при получении данных из Jira:", error);
    return [];
  }
}

async function updateTasks() {
  const tasks = await fetchJiraTasks();
  if (tasks.length > 0) {
    await csvWriter.writeRecords(tasks);
    console.log("Данные успешно обновлены в файле issues-autoupdate.csv");
  } else {
    console.log("Не удалось получить данные из Jira");
  }
}

updateTasks();
