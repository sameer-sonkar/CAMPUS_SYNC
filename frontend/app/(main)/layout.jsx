import Sidebar from '@/components/Sidebar';
import HeaderAvatar from '@/components/HeaderAvatar';
import { LayoutWrapper, MainContent, HeaderBar, PageScrollArea } from './layoutStyles';

export default function DashboardLayout({ children }) {
  return (
    <LayoutWrapper>
      <Sidebar />
      <MainContent>
        <HeaderBar>
          {/* <HeaderAvatar /> - Hidden as per user request */}
        </HeaderBar>
        <PageScrollArea>
          {children}
        </PageScrollArea>
      </MainContent>
    </LayoutWrapper>
  );
}
