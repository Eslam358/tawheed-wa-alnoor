import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 bg-sand-50 min-h-[calc(100vh-4rem)]">
        {children}
      </div>
    </div>
  );
}
