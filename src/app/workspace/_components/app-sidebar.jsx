"use client"
import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Book, Compass, LayoutDashboard, PencilRulerIcon, UserCircle2Icon, WalletCards } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./add-new-course-dialog";
import { Logo } from "@/components/logo";

const SideBarOptions = [
    {
        title: 'Painel',
        icon: LayoutDashboard,
        path: '/workspace'
    },
    {
        title: 'Meu aprendizado',
        icon: Book,
        path: '/workspace/my-learning'
    },
    {
        title: 'Explorar cursos',
        icon: Compass,
        path: '/workspace/explore'
    },
]

function AppSidebar() {
    const path = usePathname();

    return (
        <Sidebar>
            <SidebarHeader>
                <Logo href="/workspace" plain />
            </SidebarHeader>

            <SidebarContent className="gap-0">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {SideBarOptions.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.path} className={`
                                            ${path == item.path ? 'bg-accent text-accent-foreground' : ''}
                                        `}>
                                            <item.icon className="h-7 w-7" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="py-0">
                    <AddNewCourseDialog>
                        <Button>Criar curso</Button>
                    </AddNewCourseDialog>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar;
