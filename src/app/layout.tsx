import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500'],
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'La Réserve des Initiés — Cercle Privé · Antilles',
  description: "Champagnes, cognacs et spiritueux d'exception enrichis d'or 24 carats. Cercle privé sur cooptation, Antilles françaises.",
  robots: 'noindex, nofollow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
          // Scroll reveal — Intersection Observer
          (function() {
            const obs = new IntersectionObserver(
              (entries) => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
              }),
              { threshold: 0.12 }
            );
            document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
          })();
          // Navbar scroll opacity
          (function() {
            const nav = document.querySelector('nav[data-scroll-nav]');
            if (!nav) return;
            window.addEventListener('scroll', () => {
              if (window.scrollY > 60) nav.classList.add('nav-scrolled');
              else nav.classList.remove('nav-scrolled');
            }, { passive: true });
          })();
        `}} />
      </body>
    </html>
  )
}
