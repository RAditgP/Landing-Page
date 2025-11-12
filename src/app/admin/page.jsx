"use client";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import ActivityList from "../components/ActivityList";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ templates:0, messages:0, users:0 });
  const [activity, setActivity] = useState({ templates: [], messages: [], trend: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/activity")
        ]);
        if (!sRes.ok) throw new Error("Gagal ambil stats");
        if (!aRes.ok) throw new Error("Gagal ambil activity");

        const s = await sRes.json();
        const a = await aRes.json();
        setStats(s);
        setActivity(a);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Template" value={stats.templates} />
        <StatCard title="Pesan Masuk" value={stats.messages} />
        <StatCard title="Total Pengguna" value={stats.users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-3">Tren Pendaftaran Pengguna (7 hari)</h3>
          {loading ? (
            <div>Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activity.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white/5 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-3">Aktivitas Terbaru</h3>
          {loading ? <div>Loading...</div> : <ActivityList templates={activity.templates} messages={activity.messages} />}
        </div>
      </div>
    </div>
  );
}
