import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Proctor - Exam Monitoring System',
  description: 'Detect cheating behavior using hybrid AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
