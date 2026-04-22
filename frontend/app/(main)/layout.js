import Sidebar from '@/components/Sidebar';
import HeaderAvatar from '@/components/HeaderAvatar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header style={{ 
          height: '80px', 
          backgroundColor: 'var(--surface)', 
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          justifyContent: 'flex-end'
        }}>
          <HeaderAvatar />
        </header>
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
