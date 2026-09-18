"use client";

import { useState, useEffect, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import friends from "../../../public/data/friends.json";

Chart.register(...registerables);

// Interaction type configuration - hoisted for reuse
const INTERACTION_TYPES = [
  { key: "text", label: "Text", color: "#3B82F6" },
  { key: "call", label: "Call", color: "#10B981" },
  { key: "video", label: "Video", color: "#F59E0B" },
  { key: "instagram", label: "Instagram", color: "#EC4899" },
  { key: "email", label: "Email", color: "#8B5CF6" },
];

// Loading spinner component
const ChartLoader = () => (
  <div className="flex flex-col items-center justify-center h-[400px] gap-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#37A69B] animate-spin" />
    </div>
    <p className="text-slate-500 text-sm font-medium animate-pulse">
      Loading analytics...
    </p>
  </div>
);

// Skeleton placeholder for chart area
const ChartSkeleton = () => (
  <div className="flex flex-col items-center justify-center h-[400px] gap-6">
    <div className="relative w-48 h-48 rounded-full bg-slate-100 animate-pulse overflow-hidden">
      <div className="absolute inset-4 rounded-full bg-white" />
    </div>
    <div className="flex flex-wrap justify-center gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// Stat pill component for the header summary
const StatPill = ({ label, value, color }) => (
  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-sm">
    <span
      className="w-2.5 h-2.5 rounded-full"
      style={{ backgroundColor: color }}
    />
    <div className="flex flex-col">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className="text-lg font-bold text-slate-800 tabular-nums">
        {value}
      </span>
    </div>
  </div>
);

const Stats = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);

  // Simulate chart data loading with a timed reveal
  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoading(false), 1200);
    const revealTimer = setTimeout(() => setShowChart(true), 1400);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  // Memoized counts - only recalculated if friends data changes
  const counts = useMemo(() => {
    const interactions = friends.flatMap((f) => f.interactions);
    return interactions.reduce((acc, i) => {
      const type = i.type.toLowerCase();
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const totalInteractions = useMemo(
    () => Object.values(counts).reduce((sum, n) => sum + n, 0),
    [counts],
  );

  // Memoized chart data
  const data = useMemo(
    () => ({
      labels: INTERACTION_TYPES.map((t) => t.label),
      datasets: [
        {
          label: "Interactions",
          data: INTERACTION_TYPES.map((t) => counts[t.key] || 0),
          backgroundColor: INTERACTION_TYPES.map((t) => t.color),
          borderColor: "#ffffff",
          borderWidth: 3,
          hoverOffset: 12,
          hoverBorderWidth: 3,
        },
      ],
    }),
    [counts],
  );

  // Memoized chart options
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      cutout: "65%",
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 16,
            usePointStyle: true,
            pointStyle: "circle",
            font: { size: 13, family: "inherit" },
            color: "#475569",
          },
        },
        title: { display: false },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 13, weight: "600" },
          bodyFont: { size: 12 },
          displayColors: true,
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed;
              const pct = totalInteractions
                ? ((value / totalInteractions) * 100).toFixed(1)
                : 0;
              return ` ${value} interactions (${pct}%)`;
            },
          },
        },
      },
    }),
    [totalInteractions],
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto">
        {/* ================= Header ================= */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            Friendship <span className="text-[#37A69B]">Analytics</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            A breakdown of how you stay in touch with your friends.
          </p>
        </div>

        {/* ================= Stat Pills ================= */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <StatPill label="Total" value={totalInteractions} color="#37A69B" />
            {INTERACTION_TYPES.map((t) => (
              <StatPill
                key={t.key}
                label={t.label}
                value={counts[t.key] || 0}
                color={t.color}
              />
            ))}
          </div>
        )}

        {/* ================= Chart Card ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                By Interaction Types
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Distribution across all channels
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <div className="max-w-[520px] mx-auto">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <div
                className={`transition-all duration-700 ease-out ${
                  showChart
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Doughnut data={data} options={options} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
