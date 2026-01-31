import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

const SkillGraph = ({ skills }) => {
  const { isDarkMode } = useTheme();
  return (
    <div style={{ height: 400, width: "100%" }}>
      <ResponsiveContainer>
        <RadarChart
          cx="50%" // Center X position
          cy="50%" // Center Y position
          outerRadius="80%"
          data={skills}
        >
          <PolarGrid
            stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "currentColor", fontSize: 10, fontWeight: "bold" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Skills"
            dataKey="proficiency"
            stroke={isDarkMode ? "#c026d3" : "#1e293b"}
            fill={isDarkMode ? "#c026d3" : "#1e293b"}
            fillOpacity={0.4}
          />
          <Tooltip
            contentStyle={{ backgroundColor: isDarkMode ? '#1e1b4b' : '#fff', border: 'none', borderRadius: '12px' }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillGraph;
