
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className={`flex-1 overflow-auto p-4 md:p-6 bg-muted/30 ${isMobile ? 'pb-20' : ''}`}>
          {children}
        </main>
      </div>
      {isMobile && <Sidebar />}
    </div>
  );
};

export default Layout;
