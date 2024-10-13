import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BarChartDashBoard = ({ budgetList = [] }) => {
  return (
    <div className="border rounded-lg p-5">
      <h2 className="font-bold text-lg mt-7 mb-3">Activity</h2>
      <div className="w-full h-[300px] md:h-[400px] lg:w-[80%] lg:h-[300px] mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={budgetList}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSpend" stackId="a" fill="#a845d2" />
            <Bar dataKey="amount" stackId="a" fill="#C3C2FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartDashBoard;
