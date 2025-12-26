"use client";
import { create } from "zustand";

export const useDashboardSidebar = create((set) => ({
  sidebarOpen: false, // only for mobile drawer
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
}));
