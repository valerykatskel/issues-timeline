import React, { useMemo, useState } from "react";
import { ActiveTasksPriorityChart } from "./components/ActiveTasksPriorityChart";
import { DailyActivityChart } from "./components/DailyActivityChart";
import { DailyCummulativeChart } from "./components/DailyCummulativeChart";
import { PriorityDistributionChart } from "./components/PriorityDistributionChart";
import jsonData from "./data/issues";
import statusData from "./data/status.json";

const processIssueData = (data) => {
  const dailyData = {};
  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  data.forEach((issue) => {
    const [day, monthStr, year] = issue.Created.split(" ")[0].split("/");
    const month = monthMap[monthStr];
    const createdDate = new Date(
      Date.UTC(2000 + parseInt(year), month, parseInt(day))
    );

    const resolvedDate = issue.Resolved
      ? (() => {
          const [rDay, rMonthStr, rYear] =
            issue.Resolved.split(" ")[0].split("/");
          const rMonth = monthMap[rMonthStr];
          return new Date(
            Date.UTC(2000 + parseInt(rYear), rMonth, parseInt(rDay))
          );
        })()
      : null;

    const createdKey = createdDate.toISOString().split("T")[0];
    if (!dailyData[createdKey]) {
      dailyData[createdKey] = { created: 0, closed: 0 };
    }
    dailyData[createdKey].created++;

    if (
      resolvedDate &&
      (issue.Status === "Closed" ||
        issue.Status === "Resolved" ||
        issue.Status === "Done")
    ) {
      const resolvedKey = resolvedDate.toISOString().split("T")[0];
      if (!dailyData[resolvedKey]) {
        dailyData[resolvedKey] = { created: 0, closed: 0 };
      }
      dailyData[resolvedKey].closed++;
    }
  });

  let totalCreated = 0;
  let totalClosed = 0;

  return Object.entries(dailyData)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, counts]) => {
      totalCreated += counts.created;
      totalClosed += counts.closed;
      return {
        date,
        created: counts.created,
        closed: counts.closed,
        totalCreated,
        totalClosed,
      };
    });
};

const DynamicIssueTimeline = ({ data }) => {
  const [timeRange, setTimeRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const currentDateTime = useMemo(() => {
    const lastUpdate = new Date(statusData.lastUpdate);
    return lastUpdate.toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((issue) => {
      const issueDate = new Date(
        issue.Created.split(" ")[0].split("/").reverse().join("-")
      );
      const now = new Date();
      const cutoffDate = new Date(
        now.setDate(now.getDate() - parseInt(timeRange))
      );

      return (
        (timeRange === "all" || issueDate >= cutoffDate) &&
        (statusFilter === "all" || issue.Status === statusFilter) &&
        (priorityFilter === "all" || issue.Priority === priorityFilter)
      );
    });
  }, [data, timeRange, statusFilter, priorityFilter]);

  const chartData = useMemo(
    () => processIssueData(filteredData),
    [filteredData]
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="text-right text-sm text-gray-600 mb-4">
        Дата и время актуализации: {currentDateTime}
      </div>
      <DailyCummulativeChart data={chartData} />
      <ActiveTasksPriorityChart />
      <DailyActivityChart data={chartData} />
      <PriorityDistributionChart data={filteredData} />
    </div>
  );
};

const App = () => {
  return <DynamicIssueTimeline data={jsonData} />;
};

export default App;
