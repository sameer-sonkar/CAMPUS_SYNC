"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Calendar, GraduationCap, User, Settings, Folder, Code } from 'lucide-react';
import { studentService } from '@/lib/api';
import {
  SidebarContainer,
  BrandContainer,
  BrandTitle,
  BrandAccent,
  NavMenu,
  NavLinkContainer,
  NavItem,
  ActiveIndicator,
  FooterContainer,
  SignOutButton
} from './SidebarStyles';

export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const uid = localStorage.getItem('uid');
        if (!uid) return;
        const profile = await studentService.getStudent(uid);
        if (profile?.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to check admin status", error);
      }
    };
    checkAdmin();
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Planner', path: '/planner', icon: <BookOpen size={20} /> },
    { name: 'Timetable', path: '/timetable', icon: <Calendar size={20} /> },
    { name: 'Grades', path: '/grades', icon: <GraduationCap size={20} /> },
    { name: 'My Documents', path: '/documents', icon: <Folder size={20} /> },
    { name: 'Algorithms Hub', path: '/coding', icon: <Code size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Portal', path: '/admin', icon: <Settings size={20} /> });
  }

  return (
    <SidebarContainer>
      <BrandContainer>
        <BrandTitle>
          Campus<BrandAccent>Sync</BrandAccent>
        </BrandTitle>
      </BrandContainer>

      <NavMenu>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <NavLinkContainer key={item.path} href={item.path}>
              <NavItem $isActive={isActive}>
                {item.icon}
                <span>{item.name}</span>
                {isActive && (
                  <ActiveIndicator layoutId="sidebar-active" />
                )}
              </NavItem>
            </NavLinkContainer>
          );
        })}
      </NavMenu>

      <FooterContainer>
        <NavLinkContainer href="/">
          <SignOutButton>
            Sign Out
          </SignOutButton>
        </NavLinkContainer>
      </FooterContainer>
    </SidebarContainer>
  );
}
