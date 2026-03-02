'use client'

import React from 'react'

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

// #region Sample data
const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

// #endregion
const AreaChartExample = ({ isAnimationActive = true }) => (
  <AreaChart
    style={{
      width: "100%",
      maxWidth: "700px",
      maxHeight: "70vh",
      aspectRatio: 1.618,
    }}
    responsive
    data={data}
    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
  >
    <defs>
      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis width="auto" />
    <Tooltip />
    <Area
      type="monotone"
      dataKey="uv"
      stroke="#8884d8"
      fillOpacity={1}
      fill="url(#colorUv)"
      isAnimationActive={isAnimationActive}
    />
    <Area
      type="monotone"
      dataKey="pv"
      stroke="#82ca9d"
      fillOpacity={1}
      fill="url(#colorPv)"
      isAnimationActive={isAnimationActive}
    />
    <RechartsDevtools />
  </AreaChart>
);


// line chart

// #region Sample data
const data2 = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
// #endregion

const  Example = () => {
  return (
    <LineChart
      style={{
        width: "100%",
        maxWidth: "700px",
        height: "100%",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data2}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="pv"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      <RechartsDevtools />
    </LineChart>
  );
}

const index = () => {
  return (
    <div className="flex flex-row flex-1 items-center gap-3 py-3 w-full">
      <div className="bg-white shadow shadow-neutral-400 p-12 flex flex-col w-full rounded-2xl">
        <div className="flex items-center justify-between pb-4 mb-10 border-b border-gray-200">
          <h3 className="text-xl gap-2">Sales Trend</h3>
          <div className="flex flex-col">
            <h3>$00.00</h3>
            <h4 className="text-[14px] text-green-500">0.00%</h4>
          </div>
        </div>
        <Example />
      </div>

      <div className="bg-white shadow shadow-neutral-400 p-12 flex flex-col w-full rounded-2xl">
        <div className="flex items-center justify-between pb-4 mb-10 border-b border-gray-200">
          <h3 className="text-xl gap-2">Performance Metrics</h3>
          <div className="flex flex-col">
            <h3>$00.00</h3>
            <h4 className="text-[14px] text-green-500">0.00%</h4>
          </div>
        </div>
        <AreaChartExample />
      </div>
    </div>
  );
}

export default index