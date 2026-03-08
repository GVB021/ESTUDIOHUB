import { memo, useMemo } from "react";
import {
  Building2, Calendar, Film, LayoutDashboard,
  Settings, Users, LogOut, Mic2, Bell
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useStudio } from "@/hooks/use-studios";
import { useAuth } from "@/hooks/use-auth";
import { useStudioRole } from "@/hooks/use-studio-role";
import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/auth-fetch";
import { pt } from "@/lib/i18n";

interface AppSidebarProps {
  studioId: string;
}

export const AppSidebar = memo(function AppSidebar({ studioId }: AppSidebarProps) {
  const [location] = useLocation();
  const studio = useStudio(studioId);
  const { user, logout } = useAuth();
  const { canCreateProductions, canCreateSessions, canManageMembers } = useStudioRole(studioId);

  const { data: unreadCount } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
    queryFn: () => authFetch("/api/notifications/unread-count"),
    refetchInterval: 30000,
  });

  const navItems = useMemo(() => {
    const items = [
      { title: pt.nav.dashboard, url: `/studio/${studioId}/dashboard`, icon: LayoutDashboard },
    ];
    if (canCreateProductions) {
      items.push({ title: pt.nav.productions, url: `/studio/${studioId}/productions`, icon: Film });
    }
    if (canCreateSessions || canCreateProductions) {
      items.push({ title: pt.nav.sessions, url: `/studio/${studioId}/sessions`, icon: Calendar });
    }
    if (canManageMembers) {
      items.push({ title: pt.nav.members, url: `/studio/${studioId}/members`, icon: Users });
    }
    return items;
  }, [studioId, canCreateProductions, canCreateSessions, canManageMembers]);

  return (
    <Sidebar>
      <SidebarHeader className="py-5 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <Mic2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-bold tracking-tight text-sidebar-foreground">V.HUB</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-2 mb-1">
            {studio?.name || "Estudio"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-8 rounded-md transition-all duration-150 ${
                        isActive
                          ? "bg-primary/15 text-primary font-medium"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-2.5 px-2">
                        <item.icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-2 mb-1">
            {pt.nav.platform}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === `/studio/${studioId}/notifications`}
                  className={`h-8 rounded-md transition-all duration-150 ${
                    location === `/studio/${studioId}/notifications`
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <Link href={`/studio/${studioId}/notifications`} className="flex items-center gap-2.5 px-2">
                    <Bell className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-sm">{pt.notifications.title}</span>
                    {(unreadCount?.count ?? 0) > 0 && (
                      <span className="ml-auto bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount.count}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user?.role === "platform_owner" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location === "/admin"}
                    className={`h-8 rounded-md transition-all duration-150 ${
                      location === "/admin"
                        ? "bg-primary/15 text-primary font-medium"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Link href="/admin" className="flex items-center gap-2.5 px-2">
                      <Settings className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-sm">{pt.nav.admin}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-8 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-150">
              <Link href="/studios" className="flex items-center gap-2.5 px-2" data-testid="link-switch-studio">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="text-sm">{pt.auth.switchStudio}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="h-8 rounded-md text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-all duration-150 flex items-center gap-2.5 px-2 w-full"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span className="text-sm">{pt.auth.signOut}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
});
