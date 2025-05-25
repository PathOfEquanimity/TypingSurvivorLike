"use client";
import { Header } from "@/components/Header";
import { CookiesProvider } from "react-cookie";
import "@/styles/App.css";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div id="root">
          <CookiesProvider>
            <Header>{children}</Header>
          </CookiesProvider>
        </div>
      </body>
    </html>
  );
}
