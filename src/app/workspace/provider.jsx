import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import AppSidebar from "./_components/app-sidebar";
import AppHeader from "./_components/app-header";

function WorkspaceProvider({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="w-full">
                <AppHeader />

                <div className="p-5 md:p-6">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}

export default WorkspaceProvider;