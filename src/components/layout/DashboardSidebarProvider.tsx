'use client';

import { createContext, useContext, useState } from 'react';

interface SidebarCtx {
  /** Desktop (lg+) expanded vs icon-rail */
  open: boolean;
  toggle: () => void;
  /** Phone/tablet slide-in drawer */
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarCtx>({
  open: true,
  toggle: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export function DashboardSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ open, toggle: () => setOpen(v => !v), mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
