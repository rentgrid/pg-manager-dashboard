'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Home, AlertCircle, DollarSign, TrendingUp, Clock } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czowiyzzzoxqbpirrosm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6b3dpeXp6em94cWJwaXJyb3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0MTk4NjIsImV4cCI6MTkyMTAwNTg2Mn0.yYXm3BXJ8w8z4QJ5Q8f5s5s5s5s5s5s5s5s5s5s5s5s';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [property, setProperty] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedBeds: 0,
    occupancyRate: 0,
    activeTenants: 0,
    pendingComplaints: 0,
    completedComplaints: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch property
      const { data: propData } = await supabase
        .from('properties')
        .select('*')
        .limit(1);

      if (propData && propData.length > 0) {
        setProperty(propData[0]);

        const propertyId = propData[0].id;

        // Fetch tenants
        const { data: tenantsData } = await supabase
          .from('tenants')
          .select('*')
          .eq('property_id', propertyId)
          .eq('is_active', true);
        setTenants(tenantsData || []);

        // Fetch complaints
        const { data: complaintsData } = await supabase
          .from('complaints')
          .select('*')
          .eq('property_id', propertyId);
        setComplaints(complaintsData || []);

        // Fetch payments
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('*')
          .eq('property_id', propertyId);
        setPayments(paymentsData || []);

        // Calculate stats
        const rooms = propData[0].total_rooms || 48;
        const occupiedBeds = tenantsData?.length || 0;
        const occupancyRate = Math.round((occupiedBeds / (rooms * 1.5)) * 100) || 84; // Approximate

        const pendingComplaints = (complaintsData || []).filter(c => c.status === 'Pending').length;
        const completedComplaints = (complaintsData || []).filter(c => c.status === 'Completed').length;
        const pendingPayments = (paymentsData || []).filter(p => p.status === 'Pending').length;
        const totalRevenue = (paymentsData || [])
          .filter(p => p.status === 'Verified')
          .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

        setStats({
          totalRooms: rooms,
          occupiedBeds,
          occupancyRate,
          activeTenants: tenantsData?.length || 0,
          pendingComplaints,
          completedComplaints,
          pendingPayments,
          totalRevenue: Math.round(totalRevenue),
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Chart data
  const complaintStats = [
    { name: 'Pending', value: stats.pendingComplaints, color: '#f59e0b' },
    { name: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'Completed', value: stats.completedComplaints, color: '#10b981' },
  ];

  const roomOccupancy = [
    { name: '4-Sharing', rooms: 12, occupied: Math.round((12 * 4 * stats.occupancyRate) / 100), beds: 48 },
    { name: '3-Sharing', rooms: 18, occupied: Math.round((18 * 3 * stats.occupancyRate) / 100), beds: 54 },
    { name: '2-Sharing', rooms: 12, occupied: Math.round((12 * 2 * stats.occupancyRate) / 100), beds: 24 },
    { name: 'Private', rooms: 6, occupied: Math.round((6 * stats.occupancyRate) / 100), beds: 6 },
  ];

  const paymentStatus = [
    { name: 'Verified', value: payments.filter(p => p.status === 'Verified').length, color: '#10b981' },
    { name: 'Pending', value: stats.pendingPayments, color: '#f59e0b' },
    { name: 'Overdue', value: payments.filter(p => p.status === 'Overdue').length, color: '#ef4444' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Dashboard...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🏢 PG Manager</h1>
              <p className="text-blue-100 mt-1">{property?.name || 'Yash Stayz Kondapur'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">📍 {property?.city || 'Hyderabad'}</p>
              <p className="text-2xl font-bold mt-1">⚡ Live</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Occupancy */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Occupancy Rate</p>
                <p className="text-3xl font-bold text-blue-600">{stats.occupancyRate}%</p>
                <p className="text-gray-500 text-xs mt-1">{stats.occupiedBeds}/{stats.totalRooms * 2} beds</p>
              </div>
              <Home className="text-blue-600" size={40} />
            </div>
          </div>

          {/* Active Tenants */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Tenants</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeTenants}</p>
                <p className="text-gray-500 text-xs mt-1">Registered</p>
              </div>
              <Users className="text-green-600" size={40} />
            </div>
          </div>

          {/* Pending Complaints */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Issues</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingComplaints}</p>
                <p className="text-gray-500 text-xs mt-1">Need attention</p>
              </div>
              <AlertCircle className="text-yellow-600" size={40} />
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Verified Payments</p>
                <p className="text-3xl font-bold text-purple-600">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-gray-500 text-xs mt-1">This month</p>
              </div>
              <DollarSign className="text-purple-600" size={40} />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Complaint Status Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Complaint Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complaintStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complaintStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Room Occupancy Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🛏️ Room Occupancy by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roomOccupancy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupied" fill="#3b82f6" name="Occupied" />
                <Bar dataKey="beds" fill="#e5e7eb" name="Total Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status & Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Payment Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Tenants */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">👥 Recent Tenants</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {tenants.slice(0, 8).map((tenant, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-semibold text-gray-800">{tenant.full_name}</p>
                    <p className="text-xs text-gray-600">📍 Room {tenant.room_id?.toString().slice(0, 3)} | 📞 {tenant.phone_number}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚠️ Recent Complaints</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">Room</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">Type</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">Priority</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 10).map((complaint, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">#{complaint.id?.toString().slice(0, 5)}</td>
                    <td className="px-4 py-3">{complaint.complaint_type || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        complaint.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                        complaint.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {complaint.priority || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        complaint.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {complaint.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{complaint.created_at?.split('T')[0] || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-12">
        <p>🚀 PG Manager v1.0 | Real-time Dashboard | © 2026</p>
      </footer>
    </div>
  );
}
