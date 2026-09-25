import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "../../lib/utils";

export function Layout({ children, contentClassName = "" }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-black text-white selection:bg-[#10EE74] selection:text-black">
      {/* Sleek Floating Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Floating Pill Navbar */}
        <Navbar onOpenMobile={() => setMobileOpen(true)} />

        {/* Page Container: mobile scrolls naturally, desktop acts as clean single-frame */}
        <div
          className={cn(
            "flex-1 min-h-0 min-w-0 p-3 sm:p-4 overflow-y-auto lg:overflow-hidden",
            contentClassName
          )}
        >
          <div className="w-full max-w-[1600px] mx-auto h-full min-h-0">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Layout;
