"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { studentService } from '@/lib/api';

export default function HeaderAvatar() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const uid = localStorage.getItem('uid');
        if (!uid) return;
        const data = await studentService.getStudent(uid);
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile for header", error);
      }
    };
    fetchProfile();
  }, []);

  const initials = profile?.fullName 
    ? profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'CS';

  return (
    <Link href="/profile" style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
        {profile?.profilePic ? (
          <img 
            src={profile.profilePic} 
            alt="Profile" 
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
          />
        ) : (
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1A1D20' }}>
            {initials}
          </div>
        )}
      </div>
    </Link>
  );
}
