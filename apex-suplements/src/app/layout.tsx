import type { Metadata } from 'next';
import { Inter, Roboto_Slab } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import { AuthProvider } from '@/contexts/firebase-auth-context';
import { CartProvider } from '@/contexts/cart-context';
import { CheckoutProvider } from '@/contexts/checkout-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { CustomerProvider } from '@/contexts/customer-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
});

export const metadata: Metadata = {
  title: 'Apex Nutrition - Premium Supplements for Champions',
  description: 'Premium supplements trusted by professional athletes. Formulated for champions, available for everyone.',
  keywords: 'supplements, nutrition, protein, pre-workout, recovery, fitness, sports nutrition',
  authors: [{ name: 'Apex Nutrition' }],
  openGraph: {
    title: 'Apex Nutrition - Premium Supplements for Champions',
    description: 'Premium supplements trusted by professional athletes.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${robotoSlab.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <SettingsProvider>
            <CustomerProvider>
              <CartProvider>
                <CheckoutProvider>
                  <Header />
                  <main id="main-content">
                    {children}
                  </main>
                </CheckoutProvider>
              </CartProvider>
            </CustomerProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
