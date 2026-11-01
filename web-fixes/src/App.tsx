import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AdminLogin } from './components/AdminLogin';

// Protected Admin Layout Component
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authLoading, isAdmin } = useApp();

  if (authLoading) {
    return (
      <div 
        dir="rtl"
        style={{
          minHeight: '100vh',
          backgroundColor: '#050B14',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFE58F'
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '4px solid #334155',
          borderTopColor: '#E5C158',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#CBD5E1' }}>جارٍ فحص صلاحيات الإدارة الرسمية...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Admin Dashboard Shell
const AdminDashboard: React.FC = () => {
  const { bookings, teamMembers, unreadMessagesCount, logout } = useApp();

  return (
    <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#050B14', color: '#F4F6FB', padding: '24px' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #1E293B',
        paddingBottom: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '22px', color: '#FFE58F', margin: 0 }}>لوحة الإدارة السيادية — IBRA PRODUCTION</h1>
          <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '13px' }}>إدارة الحجوزات، طاقم العمل، والتقارير المالية</p>
        </div>
        <button
          onClick={logout}
          style={{
            backgroundColor: '#1E293B',
            color: '#F87171',
            border: '1px solid #EF4444',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          تسجيل الخروج
        </button>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#0E172A', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>إجمالي الحجوزات</span>
          <h2 style={{ fontSize: '28px', color: '#FFE58F', margin: '8px 0 0' }}>{bookings.length}</h2>
        </div>
        <div style={{ backgroundColor: '#0E172A', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>طاقم العمل الميداني</span>
          <h2 style={{ fontSize: '28px', color: '#E5C158', margin: '8px 0 0' }}>{teamMembers.length || 15} تخصص</h2>
        </div>
        <div style={{ backgroundColor: '#0E172A', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>الرسائل الجديدة</span>
          <h2 style={{ fontSize: '28px', color: '#38BDF8', margin: '8px 0 0' }}>{unreadMessagesCount}</h2>
        </div>
        <div style={{ backgroundColor: '#0E172A', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>حالة النظام والتزامن</span>
          <h2 style={{ fontSize: '16px', color: '#4ADE80', margin: '14px 0 0' }}>● متصل بـ Firestore</h2>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
