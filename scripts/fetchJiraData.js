require("dotenv").config();
const axios = require("axios");

const jiraHost = process.env.JIRA_HOST;
const jiraApiToken = process.env.JIRA_API_TOKEN;
const jiraEmail = process.env.JIRA_EMAIL;

const fetchIssues = async (jql) => {
  try {
    const headers = {
      Authorization: `Basic ${Buffer.from(
        `${jiraEmail}:${jiraApiToken}`
      ).toString("base64")}`,
      Accept: "application/json",
    };
    const response = await axios.get(`${jiraHost}/rest/api/2/search`, {
      params: {
        jql: jql,
        maxResults: 1000,
        fields: "priority,status,created,resolved",
      },
      headers,
    });

    return response.data.issues.map((issue) => ({
      Priority: issue.fields.priority.name,
      Status: issue.fields.status.name,
      Created: new Date(issue.fields.created).toLocaleString("ru-RU"),
      Resolved: issue.fields.resolutiondate
        ? new Date(issue.fields.resolutiondate).toLocaleString("ru-RU")
        : "",
      "Custom field (Resolution date)": "",
    }));
  } catch (error) {
    console.error("Ошибка при получении данных из Jira:", error);
    return [];
  }
};

const fetchActiveIssues = () => {
  const jql =
    "project = ADAF AND status != Closed ORDER BY priority DESC, status ASC, created DESC";
  return fetchIssues(jql);
};

const fetchAllIssues = () => {
  const jql = "project = ADAF ORDER BY priority DESC, status ASC, created DESC";
  return fetchIssues(jql);
};

module.exports = { fetchActiveIssues, fetchAllIssues };
