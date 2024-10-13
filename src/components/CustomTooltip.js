import React from "react";

export const CustomTooltip = ({ active, payload, label, chartType }) => {
  if (active && payload && payload.length) {
    const created = payload.find((p) => p.dataKey === "created")?.value || 0;
    const closed = payload.find((p) => p.dataKey === "closed")?.value || 0;
    const totalCreated =
      payload.find((p) => p.dataKey === "totalCreated")?.value || 0;
    const totalClosed =
      payload.find((p) => p.dataKey === "totalClosed")?.value || 0;

    const isCumulativeChart = chartType === "cumulative";

    const convergence = isCumulativeChart
      ? (
          (Math.min(totalCreated, totalClosed) /
            Math.max(totalCreated, totalClosed)) *
          100
        ).toFixed(1)
      : null;

    const openBugs = totalCreated - totalClosed;

    return (
      <div className="custom-tooltip bg-white p-3 border border-gray-300 rounded shadow">
        <p className="label font-bold">{`Дата: ${label}`}</p>
        {isCumulativeChart ? (
          <>
            <p className="total-created text-purple-600">{`Всего создано: ${totalCreated}`}</p>
            <p className="total-closed text-green-600">{`Всего закрыто: ${totalClosed}`}</p>
            <p className="open-bugs text-orange-600">{`Открытых багов: ${openBugs}`}</p>
            <p className="convergence text-blue-600">{`Сходимость: ${convergence}%`}</p>
          </>
        ) : (
          <>
            <p className="created text-purple-600">{`Создано: ${created}`}</p>
            <p className="closed text-green-600">{`Закрыто: ${closed}`}</p>
          </>
        )}
      </div>
    );
  }

  return null;
};
