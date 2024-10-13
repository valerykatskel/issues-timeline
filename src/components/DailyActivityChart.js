import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

export const DailyActivityChart = ({ data }) => {
  return (
    <>
      <h2 className="text-2xl font-bold my-6 text-gray-800">
        Ежедневная активность
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
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
          <Tooltip content={<CustomTooltip chartType="daily" />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "14px",
            }}
          />
          <Bar dataKey="created" name="Создано" fill="#8884d8" />
          <Bar dataKey="closed" name="Закрыто" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};
