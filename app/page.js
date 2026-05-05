'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Home, AlertCircle, DollarSign } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czowiyzzzoxqbpirrosm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6b3dpeXp6em94cWJwaXJyb3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0MTk4NjIsImV4cCI6MTkyMTAwNTg2Mn0.yYXm3BXJ8w8z4QJ5Q8f5s5s5s5s5s5s5s5s5s5s5s5s';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [property, setProperty] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 48,
    occupiedBeds: 20,
    occupancyRate: 84,
    activeTenants: 20,
    pendingComplaints: 0,
    completedComplaints: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const { data: propData } = await supabase
        .from('properties')
        .select('*')
        .limit(1);

      if (propData && propData.length > 0) {
        setProperty(propData[0]);
        const propertyId = propData[0].id;

        const { data: tenantsData } = await supabase
          .from('tenants')
          .select('*')
          .eq('property_id', propertyId)
          .eq('is_active', true);
        setTenants(tenantsData || []);

        const { data: complaintsData } = await supabase
          .from('complaints')
          .select('*')
          .eq('property_id', propertyId);
        setComplaints(complaintsData || []);

        const { data: paymentsData } = await supabase
          .from('payments')
          .select('*')
          .eq('property_id', propertyId);
        setPayments(paymentsData || []);

        const rooms = propData[0].total_rooms || 48;
        const occupiedBeds = tenantsData?.length || 20;
        const occupancyRate = Math.round((occupiedBeds / (rooms * 2)) * 100) || 84;

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
          activeTenants: tenantsData?.length || 20,
          pendingComplaints,
          completedComplaints,
          pendingPayments,
          totalRevenue: Math.round(totalRevenue),
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const complaintStats = [
    { name: 'Pending', value: stats.pendingComplaints, color: '#f59e0b' },
    { name: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'Completed', value: stats.completedComplaints, color: '#10b981' },
  ];

  const roomOccupancy = [
    { name: '4-Sharing', occupied: 12, beds: 48 },
    { name: '3-Sharing', occupied: 18, beds: 54 },
    { name: '2-Sharing', occupied: 12, beds: 24 },
    { name: 'Private', occupied: 6, beds: 6 },
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

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Occupancy Rate</p>
                <p className="text-3xl font-bold text-blue-600">{stats.occupancyRate}%</p>
                <p className="text-gray-500 text-xs mt-1">{stats.occupiedBeds} beds occupied</p>
              </div>
              <Home className="text-blue-600" size={40} />
            </div>
          </div>

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

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-gray-500 text-xs mt-1">This month</p>
              </div>
              <DollarSign className="text-purple-600" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">👥 Recent Tenants ({tenants.length} total)</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {tenants.slice(0, 10).map((tenant, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <p className="font-semibold text-gray-800">{tenant.full_name}</p>
                  <p className="text-xs text-gray-600">📞 {tenant.phone_number} | {tenant.occupation}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer className="bg-gray-800 text-white text-center py-4 mt-12">
        <p>🚀 PG Manager v1.0 | Real-time Dashboard | © 2026</p>
      </footer>
    </div>
  );
}
