import { Outlet, Navigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;