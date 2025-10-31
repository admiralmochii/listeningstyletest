// src/App.jsx
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4A90E2", "#50E3C2", "#F5A623", "#B8E986", "#BD10E0", "#F8E71C"];

export default function ListeningAnalytics() {
  // Example data – replace with live data from your backend or Firestore
  const [questionStats, setQuestionStats] = useState([
    { question: "Q1: I tend to say 'That's good.'", counts: { 7: 35, 5: 60, 3: 40, 1: 15 } },
    { question: "Q2: People sometimes say things to make me feel bad.", counts: { 7: 25, 5: 55, 3: 45, 1: 25 } },
  ]);

  const [styleBreakdown, setStyleBreakdown] = useState({
    A: 40,
    B: 25,
    C: 15,
    D: 10,
    E: 10,
  });

  // Convert counts to chart data
  const makePieData = (counts) =>
    Object.entries(counts).map(([label, value]) => ({
      name: label === "7" ? "Very often" : label === "5" ? "Quite often" : label === "3" ? "Seldom" : "Very seldom",
      value,
    }));

  const stylePieData = Object.entries(styleBreakdown).map(([style, value]) => ({
    name: `Style ${style}`,
    value,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-gray-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-600 mb-6">
          Listening Styles Test Analytics
        </h1>

        <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-gray-700">
          Question-by-Question Response Distribution
        </h2>

        <div className="space-y-8">
          {questionStats.map((q, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-700">{q.question}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={makePieData(q.counts)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {makePieData(q.counts).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-4 text-gray-700">
          Overall Listening Style Breakdown
        </h2>

        <div className="p-4 border border-gray-200 rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stylePieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stylePieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
