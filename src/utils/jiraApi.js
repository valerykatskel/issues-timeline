require("dotenv").config();
import axios from "axios";

export const fetchActiveIssues = async (jqlFilter) => {
  try {
    const response = await axios.get(
      `${process.env.JIRA_HOST}/rest/api/3/search`,
      {
        params: {
          jql: jqlFilter,
          fields: "priority,status",
        },
        auth: {
          username: process.env.JIRA_EMAIL,
          password: process.env.JIRA_API_TOKEN,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data.issues.map((issue) => ({
      Priority: issue.fields.priority.name,
      Status: issue.fields.status.name,
    }));
  } catch (error) {
    console.error(
      "Ошибка при получении данных из Jira:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
