import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/public/logo.png";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DashboardLinks from "../components/dashboard-links";

export default function DashboardLayout({}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen w-full grid md:grid-col-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden md:block border-r bg-muted/40 ">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2">
                <Image src={Logo} alt="logo" className="size-6" />
                <p className="text-xl font-bold">
                  Cal <span className="text-primary">Marshal</span>
                </p>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 lg:px-4">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="w-full h-14 flex items-center border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="md:hidden shrink-0"
                  size="icon"
                  variant="outline"
                >
                  <Menu />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2">
                  <DashboardLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </header>
        </div>
      </div>
    </>
  );
}
