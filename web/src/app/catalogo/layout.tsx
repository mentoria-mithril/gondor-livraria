import { AppSidebar } from "@/components/layout/Sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-[#F2E9D8]">
                <SidebarTrigger className="md:hidden" />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
