import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Real-Time Analytics Dashboard",
  description: "Production-ready analytics dashboard with live feed and charts",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
