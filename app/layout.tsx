// app/layout.tsx
import ThemeRegistry from "./ThemeRegistry";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{overflow: 'hidden'}}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
