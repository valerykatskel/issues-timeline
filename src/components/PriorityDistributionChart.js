import React, { useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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

const COLORS = {
  Blocker: "#800000", // Бордовый для блокеров
  Critical: "#FF0000", // Ярко-красный для критических
  Major: "#FF6666", // Бледно-красный для мажорных
  Medium: "#FFD700", // Золотой (желтый) для средних
  Minor: "#4169E1", // Синий для низких/минорных
  Low: "#4169E1", // Тот же синий для низких (если они отличаются от минорных)
};

export const PriorityDistributionChart = ({ data }) => {
  const priorityData = useMemo(() => processPriorityData(data), [data]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Распределение ВСЕХ заведенных задач по приоритетам
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
            {priorityData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[entry.name] || "#8884d8"}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${props.payload.percentage}%`,
              name,
            ]}
          />
          <Legend
            formatter={(value, entry) => `${value}: ${entry.payload.value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};