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
import { Activity, TrendingUp } from 'lucide-react';
import { ResponsiveContainer } from "recharts";

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
  <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
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
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="pv"
          stroke="#82ca9d"
          fill="url(#colorPv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
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
      <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </LineChart>
  );
}

const index = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4 w-full">
      {/* SALES TREND */}
      <div className="bg-white shadow shadow-neutral-300 p-4 sm:p-6 lg:p-8 flex flex-col w-full rounded-2xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
          <h3 className="flex text-lg sm:text-xl gap-2 items-center">
            <TrendingUp className="text-blue-500" />
            Sales Trend
          </h3>
          <div>
            <h3>$00.00</h3>
            <h4 className="text-sm text-green-500">0.00%</h4>
          </div>
        </div>
        <Example />
      </div>

      {/* PERFORMANCE */}
      <div className="bg-white shadow shadow-neutral-300 p-4 sm:p-6 lg:p-8 flex flex-col w-full rounded-2xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
          <h3 className="flex text-lg sm:text-xl gap-2 items-center">
            <Activity className="text-purple-500" />
            Performance Metrics
          </h3>
          <div>
            <h3>$00.00</h3>
            <h4 className="text-sm text-green-500">0.00%</h4>
          </div>
        </div>
        <AreaChartExample />
      </div>
    </div>
  );
}

export default index