// src/components/StatCard.jsx
"use client";
export default function StatCard({ title, value }) {
  return (
    <div className="bg-white/90 dark:bg-gray-800 rounded-2xl shadow p-6">
      <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}
