"use client";
import { motion } from 'framer-motion';
import { User, Mail, Shield, Book } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Your Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal information.</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}
      >
        <div style={{ position: 'relative' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900, color: '#1A1D20' }}>
            CS
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--surface)', padding: '0.5rem', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            ✏️
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>John Doe</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>student@university.edu</p>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', backgroundColor: 'var(--background)', borderRadius: '12px', gap: '1rem' }}>
            <Book color="var(--primary-dark)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Branch</div>
              <div style={{ fontWeight: 800 }}>Computer Science (CSE)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', backgroundColor: 'var(--background)', borderRadius: '12px', gap: '1rem' }}>
            <User color="var(--primary-dark)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Roll Number</div>
              <div style={{ fontWeight: 800 }}>2401CS01</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', backgroundColor: 'var(--background)', borderRadius: '12px', gap: '1rem' }}>
            <Shield color="var(--primary-dark)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Role</div>
              <div style={{ fontWeight: 800 }}>Student</div>
            </div>
          </div>
        </div>

        <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
          Edit Profile
        </button>
      </motion.div>
    </div>
  );
}
