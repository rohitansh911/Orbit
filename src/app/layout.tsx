import type { Metadata } from "next";
import { EnergyProvider } from "@/context/EnergyContext";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit — Engineering Career Copilot",
  description:
    "Orbit helps aspiring engineers track skills, discover opportunities, and accelerate their career progression with AI-powered insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist.css"
          rel="stylesheet"
        />
      </head>
      <body className="text-on-surface bg-background antialiased">
        <AuthProvider>
          <UserProvider>
            <EnergyProvider>
              <Toaster 
                position="bottom-center"
                toastOptions={{
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: 600,
                  }
                }}
              />
              <div className="noise-overlay" />
              {children}
            </EnergyProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
