import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { fetchActiveIssues } from "../utils/jiraApi";

const processPriorityData = (data) => {
  const priorityCounts = data.reduce((acc, issue) => {
    acc[issue.Priority] = (acc[issue.Priority] || 0) + 1;
    return acc;
  }, {});

  const totalIssues = data.length;
  return Object.entries(priorityCounts).map(([priority, count]) => ({
    name: priority,
    value: count,
    percentage: ((count / totalIssues) * 100).toFixed(1),
  }));
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export const PriorityDistributionOpenTasksChart = () => {
  const [priorityData, setPriorityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const jqlFilter =
        "parent = ADAF-9226 AND status != Closed ORDER BY priority DESC, status DESC, created ASC";
      const activeIssues = await fetchActiveIssues(jqlFilter);
      const processedData = processPriorityData(activeIssues);
      setPriorityData(processedData);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Распределение активных/открытых задач по приоритетам
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={priorityData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {priorityData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${props.payload.percentage}%`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
