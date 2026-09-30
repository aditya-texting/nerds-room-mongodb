"use client";

import React from 'react';
import { Users, Calendar, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardClient({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Users</p>
            <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-full">
            <Calendar className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Events</p>
            <h3 className="text-3xl font-bold">{stats.totalEvents}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-full">
            <ShieldCheck className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Organizers</p>
            <h3 className="text-3xl font-bold">{stats.totalOrganizers}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Working Professionals vs Students vs Others */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-lg font-semibold mb-6">User Demographics</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.demographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.demographics.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Roles Distribution */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Participants vs Organizers</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.roles} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.roles.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
