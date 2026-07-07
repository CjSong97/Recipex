import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Nav from "@/components/Nav";

const display = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata = {
  title: "Recipex — weekly dinner planner",
  description:
    "Plan 3-5 dinners a week, get a unified shopping list, and explore ingredient pairings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>
          <Nav />
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
