'use client'

import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  Bar,
  Line,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

// #region Sample data
const data = [
  {
    name: "Jan",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "March",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "April",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "May",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "June",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "July",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Augst",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Sept",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Oct",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Nov",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Dec",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

// #endregion
const SalesOverview = ({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) => (
  <ComposedChart
    style={{
      width: "100%",
      maxWidth: "700px",
      maxHeight: "70vh",
      aspectRatio: 1.618,
    }}
    responsive
    data={data}
  >
    <CartesianGrid stroke="#f5f5f5" />
    <XAxis dataKey="name" />
    <YAxis width="auto" />
    <Legend />
    <Tooltip />
    <Area
      type="monotone"
      dataKey="amt"
      fill="#3c315c"
      stroke="#8884d8"
      isAnimationActive={isAnimationActive}
    />
    <Bar
      dataKey="pv"
      barSize={20}
      fill="#bb8a2f"
      isAnimationActive={isAnimationActive}
    />
    <Line
      type="monotone"
      dataKey="uv"
      stroke="#624d78"
      isAnimationActive={isAnimationActive}
    />
    <RechartsDevtools />
  </ComposedChart>
);

export default SalesOverview;
