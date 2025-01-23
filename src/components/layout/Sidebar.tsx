import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  User,
  CreditCard,
  Settings,
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Contractors", path: "/contractors", icon: User },
    { name: "Payments", path: "/payments", icon: CreditCard },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <ShadcnSidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          ProjectHub
        </h1>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <SidebarMenuItem key={link.path} className="mb-1">
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={link.name}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Link to={link.path} className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;