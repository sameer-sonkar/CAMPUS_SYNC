"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Calendar, GraduationCap, User } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Planner', path: '/planner', icon: <BookOpen size={20} /> },
    { name: 'Timetable', path: '/timetable', icon: <Calendar size={20} /> },
    { name: 'Grades', path: '/grades', icon: <GraduationCap size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid rgba(0,0,0,0.05)',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '0 1rem', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>
          Campus<span style={{ color: 'var(--primary-dark)' }}>Sync</span>
        </h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#1A1D20' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 600,
                transition: 'all 0.2s ease',
                position: 'relative'
              }}>
                {item.icon}
                <span>{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    style={{
                      position: 'absolute',
                      left: 0, right: 0, top: 0, bottom: 0,
                      backgroundColor: 'var(--primary)',
                      borderRadius: '12px',
                      zIndex: -1
                    }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <Link href="/">
          <div style={{
            color: 'var(--danger)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}>
            Sign Out
          </div>
        </Link>
      </div>
    </div>
  );
}
