"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MeritResult } from "@/lib/calculator";

interface Props {
  results: MeritResult[];
}

export default function MeritChart({ results }: Props) {
  const data = results.map((r) => ({
    name: r.universityShortName,
    aggregate: r.aggregate,
    cutoff: r.cutoff,
    program: r.programName.replace("BS ", ""),
  }));

  return (
    <div className="w-full h-[300px] sm:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          barGap={2}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#166534" }}
            axisLine={{ stroke: "#bbf7d0" }}
          />
          <YAxis
            domain={[40, 100]}
            tick={{ fontSize: 11, fill: "#166534" }}
            axisLine={{ stroke: "#bbf7d0" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #bbf7d0",
              borderRadius: "12px",
              fontSize: 12,
              padding: "8px 12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="aggregate" name="Your Merit" fill="#16a34a" radius={[6, 6, 0, 0]} />
          <Bar dataKey="cutoff" name="Cutoff" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
