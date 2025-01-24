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
    { name: "Tasks", path: "/tasks", icon: Briefcase },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Contractors", path: "/contractors", icon: User },
    { name: "Payments", path: "/payments", icon: CreditCard },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold text-primary">ProjectHub</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <SidebarMenuItem key={link.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === link.path}
                  tooltip={link.name}
                >
                  <Link to={link.path}>
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
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