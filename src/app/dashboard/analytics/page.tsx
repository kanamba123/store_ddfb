"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Stats = {
  users: number;
  sessions: number;
  bounceRate: number;
  revenue: number;
};

type UserTrend = {
  date: string;
  users: number;
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    users: 1500,
    sessions: 4200,
    bounceRate: 38,
    revenue: 18500,
  });

  const [userTrend, setUserTrend] = useState<UserTrend[]>([]);

  useEffect(() => {
    // Simulation d'appel API
    const fetchData = () => {
      // Simuler des données journalières sur 7 jours
      const trendData = [
        { date: "01 Aug", users: 210 },
        { date: "02 Aug", users: 320 },
        { date: "03 Aug", users: 450 },
        { date: "04 Aug", users: 380 },
        { date: "05 Aug", users: 520 },
        { date: "06 Aug", users: 610 },
        { date: "07 Aug", users: 700 },
      ];

      setUserTrend(trendData);

      // Mettre à jour les stats (simulé)
      setStats({
        users: 2500,
        sessions: 4800,
        bounceRate: 33,
        revenue: 22000,
      });
    };

    // Simuler un délai
    const timer = setTimeout(fetchData, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 dark:bg-gray-900 ">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Utilisateurs" value={stats.users.toLocaleString()} />
        <StatCard label="Sessions" value={stats.sessions.toLocaleString()} />
        <StatCard label="Taux de rebond" value={`${stats.bounceRate}%`} />
        <StatCard
          label="Revenus"
          value={`${stats.revenue.toLocaleString()} €`}
        />
      </div>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-none p-6 border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
          Tendance des utilisateurs (7 derniers jours)
        </h2>
        {userTrend.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            Chargement des données...
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={userTrend}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.2}
              />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                  borderRadius: "0.5rem",
                }}
                itemStyle={{ color: "#f3f4f6" }}
                labelStyle={{ color: "#f3f4f6", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#818cf8"
                strokeWidth={3}
                activeDot={{
                  r: 8,
                  fill: "#6366f1",
                  stroke: "#4f46e5",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-none p-5 flex flex-col items-center justify-center border dark:border-gray-700">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
