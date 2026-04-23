"use client";
import { useState, useEffect } from 'react';
import { studentService } from '@/lib/api';
import { HeaderLink, ProfileWrapper, ProfileImage, InitialsAvatar } from './HeaderStyles';

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
    <HeaderLink href="/profile">
      <ProfileWrapper>
        {profile?.profilePic ? (
          <ProfileImage 
            src={profile.profilePic} 
            alt="Profile" 
          />
        ) : (
          <InitialsAvatar>
            {initials}
          </InitialsAvatar>
        )}
      </ProfileWrapper>
    </HeaderLink>
  );
}
