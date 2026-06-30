import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import LayoutClient from "./LayoutClient";
import { Toaster } from "react-hot-toast"; // Toast provider

export const metadata = {
  title: "TradeHub",
  description: "Buy and sell products on TradeHub",
  icons: {
    icon: "/images/company.png",
    apple: "/images/company.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body suppressHydrationWarning={true}>
        <LayoutClient>
          {children}
        </LayoutClient>
        <Toaster
          position="down-right"
          toastOptions={{
            style: {
              background: "hsl(var(--toast-bg, #333))",
              color: "hsl(var(--toast-fg, #fff))",
            },
          }}
        />
      </body>
    </html>
  );
}
