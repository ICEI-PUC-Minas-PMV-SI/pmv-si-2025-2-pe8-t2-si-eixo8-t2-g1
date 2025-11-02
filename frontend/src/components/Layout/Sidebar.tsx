import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  ClipboardCheck,
  CreditCard,
  Settings,
  Menu,
  User,
  Home,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from "@/assets/logo.png";

const navItems = [
  {
    name: "Painel Inicial",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Agendamento",
    href: "/agendamento",
    icon: Calendar,
  },
  {
    name: "Atendimento",
    href: "/atendimento",
    icon: ClipboardCheck,
  },
  {
    name: "Pacientes",
    href: "/pacientes",
    icon: Users,
  },
  {
    name: "Documentos",
    href: "/documentos",
    icon: FileText,
  },
  {
    name: "Faturamento",
    href: "/faturamento",
    icon: CreditCard,
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-bottom">
        <nav className="flex justify-around items-center py-2 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md transition-colors min-w-[60px]",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon size={20} className="mb-1" />
              <span className="text-xs font-medium truncate w-full text-center">
                {item.name.split(' ')[0]}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-background border-r border-border h-screen transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b border-border h-16">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-clinic-teal flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg">neurohabiliTo</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed ? "mx-auto" : "ml-auto")}
        >
          <Menu size={20} />
        </Button>
      </div>

      <nav className="p-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center rounded-md py-2 text-sm font-medium transition-colors hover:bg-muted",
                  collapsed ? "justify-center px-2" : "px-3",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  size={20}
                  className={cn(collapsed ? "mx-0" : "mr-2")}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
