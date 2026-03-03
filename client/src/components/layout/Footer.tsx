import { Link } from "wouter";
import { useAppStore } from "@/lib/store";
import { Instagram, Facebook, Mail, MapPin } from "lucide-react";

export function Footer() {
  const { t } = useAppStore();
  
  return (
    <footer className="bg-foreground text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-display font-bold text-primary mb-4">
              Air Bliss<span className="text-accent">.</span>
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {t.hero.subtitle}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.nav.shop}</h4>
            <ul className="space-y-3 text-white/70 text-sm flex flex-col items-start">
              <Link href="/shop" className="hover:text-primary transition-colors">{t.categories.forHim}</Link>
              <Link href="/shop" className="hover:text-primary transition-colors">{t.categories.forHer}</Link>
              <Link href="/shop" className="hover:text-primary transition-colors">{t.categories.unisex}</Link>
              <Link href="/shop" className="hover:text-primary transition-colors">{t.categories.air}</Link>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3 text-white/70 text-sm flex flex-col items-start">
              <Link href="/about" className="hover:text-primary transition-colors">{t.nav.about}</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">{t.nav.contact}</Link>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.nav.contact}</h4>
            <ul className="space-y-4 text-white/70 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>Cairo, Egypt<br/>Available Nationwide</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>hello@airbliss.com</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-white/50 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Air Bliss. All rights reserved.</p>
          <p>Made with ❤️ in Egypt</p>
        </div>
      </div>
    </footer>
  );
}
