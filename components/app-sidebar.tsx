"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calculator,
  BarChart3,
  List,
  Settings,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Hasar Kayıt", href: "/hasar-kayit", icon: FileText },
  { name: "Maliyet Hesaplama", href: "/maliyet-hesaplama", icon: Calculator },
  { name: "Raporlar", href: "/raporlar", icon: BarChart3 },
  { name: "Hasar Listesi", href: "/hasar-listesi", icon: List },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Leaf className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-sidebar-foreground">
              Tarım İlçe
            </h1>
            <p className="text-xs text-sidebar-foreground/70">
              Afet Hasar Sistemi
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-3">
            Ana Menü
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <Link
            href="/ayarlar"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
            Ayarlar
          </Link>
          <div className="mt-4 px-3">
            <p className="text-xs text-sidebar-foreground/50">
              T.C. Tarım ve Orman Bakanlığı
            </p>
            <p className="text-xs text-sidebar-foreground/40 mt-1">
              v1.0.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
