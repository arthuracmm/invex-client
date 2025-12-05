import type { Metadata } from "next";
import { Raleway } from "next/font/google";

import { Inter } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INVEX",
  description: "Sistema de gestão de estoque",
  icons: 'images/akin-N-icon.png'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={raleway.className}>
        <ThemeRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}