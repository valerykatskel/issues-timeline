import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

export const DailyCummulativeChart = ({ data }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Кумулятивная временная шкала задач
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#666" }}
            tickFormatter={(tick) => {
              const date = new Date(tick);
              return `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`;
            }}
            stroke="#666"
          />
          <YAxis tick={{ fontSize: 12, fill: "#666" }} stroke="#666" />
          <Tooltip content={<CustomTooltip chartType="cumulative" />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "14px",
            }}
          />
          <Line
            type="monotone"
            dataKey="totalCreated"
            name="Всего создано"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="totalClosed"
            name="Всего закрыто"
            stroke="#82ca9d"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};
