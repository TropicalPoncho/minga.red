import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "minga.red",
  description: "Plataforma web de información descentralizada, debates y organización ciudadana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
