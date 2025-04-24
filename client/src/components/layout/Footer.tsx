import { Link } from "wouter";
import { 
  Moon,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-secondary pt-16 pb-6 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-accent text-3xl mr-2">
                <Moon className="h-8 w-8" />
              </span>
              <h2 className="text-2xl font-heading font-bold text-accent">Astro Sight</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Yıldızların rehberliğinde kendi yolunuzu keşfedin. Uzman astrologlarımız ve detaylı analizlerimizle yanınızdayız.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-foreground hover:bg-accent hover:text-secondary transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-foreground hover:bg-accent hover:text-secondary transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-foreground hover:bg-accent hover:text-secondary transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-foreground hover:bg-accent hover:text-secondary transition-all"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-6">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-accent transition-colors">
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link href="/zodiac-signs" className="text-muted-foreground hover:text-accent transition-colors">
                  Burçlar
                </Link>
              </li>
              <li>
                <Link href="/birth-chart" className="text-muted-foreground hover:text-accent transition-colors">
                  Doğum Haritası
                </Link>
              </li>
              <li>
                <Link href="/compatibility" className="text-muted-foreground hover:text-accent transition-colors">
                  Burç Uyumu
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-6">Astroloji Kaynakları</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Gezegenler
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Evler
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Elementler
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Açılar
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Retrolar
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Astroloji Sözlüğü
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-6">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-accent mr-3 mt-1">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="text-muted-foreground">İstanbul, Türkiye</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 mt-1">
                  <Phone className="h-5 w-5" />
                </span>
                <span className="text-muted-foreground">+90 212 123 45 67</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 mt-1">
                  <Mail className="h-5 w-5" />
                </span>
                <span className="text-muted-foreground">iletisim@astrosight.com</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-foreground font-medium mb-3">Bültenimize Abone Olun</h4>
              <form className="flex">
                <Input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="rounded-r-none border-r-0"
                />
                <Button
                  type="submit"
                  className="bg-accent text-secondary rounded-l-none"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © 2023 Astro Sight. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-accent text-sm transition-colors">
              Gizlilik Politikası
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent text-sm transition-colors">
              Kullanım Koşulları
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent text-sm transition-colors">
              Çerez Politikası
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
