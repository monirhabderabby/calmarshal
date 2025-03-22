"use client";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  HomeIcon,
  LucideIcon,
  Settings,
  User2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface iAppProps {
  id: number;
  name: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardLinks = [
  {
    id: 0,
    name: "Event Type",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Meetings",
    href: "/dashboard/meetings",
    icon: User2,
  },
  {
    id: 2,
    name: "Availability",
    href: "/dashboard/availibility",
    icon: CalendarCheck,
  },
  {
    id: 3,
    name: "Seetings",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as iAppProps[];

const DashboardLinks = () => {
  const pathName = usePathname();
  return (
    <>
      {dashboardLinks.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={cn(
            pathName === link.href
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground",
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
          )}
        >
          <link.icon className="size-4 " /> {link.name}
        </Link>
      ))}
    </>
  );
};

export default DashboardLinks;
