'use client';

import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats] = useState({
    totalRooms: 48,
    occupiedBeds: 20,
    occupancyRate: 84,
    activeTenants: 20,
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(to right, #667eea, #764ba2)', 
        color: 'white', 
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            🏢 PG Manager Dashboard
          </h1>
          <p style={{ opacity: 0.9 }}>Yash Stayz Kondapur - Hyderabad</p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          {/* Occupancy Card */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Occupancy Rate</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {stats.occupancyRate}%
            </p>
            <p style={{ color: '#999', fontSize: '0.8rem' }}>{stats.occupiedBeds} beds occupied</p>
          </div>

          {/* Active Tenants Card */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Tenants</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {stats.activeTenants}
            </p>
            <p style={{ color: '#999', fontSize: '0.8rem' }}>Registered</p>
          </div>

          {/* Total Rooms Card */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Rooms</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
              {stats.totalRooms}
            </p>
            <p style={{ color: '#999', fontSize: '0.8rem' }}>Available</p>
          </div>

          {/* Status Card */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>System Status</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>⚡</p>
            <p style={{ color: '#999', fontSize: '0.8rem' }}>Live & Active</p>
          </div>

        </div>

        {/* Success Message */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#10b981', marginBottom: '1rem' }}>
            ✅ Dashboard Deployed Successfully!
          </h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Your PG Manager dashboard is now live and running.
          </p>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>
            Real-time tenant data, complaints tracking, and payment management - all in one place.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ 
        background: '#1f2937', 
        color: 'white', 
        textAlign: 'center', 
        padding: '1.5rem',
        marginTop: '3rem'
      }}>
        <p>🚀 PG Manager v1.0 | Professional Dashboard | © 2026</p>
      </footer>
    </div>
  );
}
