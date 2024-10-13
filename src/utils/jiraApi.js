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
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_PASSWORD,
        },
      }
    );

    return response.data.issues.map((issue) => ({
      Priority: issue.fields.priority.name,
      Status: issue.fields.Status,
    }));
  } catch (error) {
    console.error("Ошибка при получении данных из Jira:", error);
    return [];
  }
};
