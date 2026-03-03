import { Link } from "wouter";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Clock, Wallet, Sparkles, Gift, ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ui/ProductCard";

export default function Home() {
  const { t, lang } = useAppStore();
  const { data: products, isLoading } = useProducts();

  const bestSellers = products?.filter(p => p.isBestSeller).slice(0, 4) || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-50 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight mb-6">
              {t.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 text-balance leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                {t.hero.cta}
                <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold bg-background text-foreground border-2 border-primary/20 hover:bg-secondary/50 hover:border-primary/40 transition-all duration-300 text-lg"
              >
                {t.nav.about}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16">{t.categories.title}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'Spray', title: lang === 'ar' ? 'بخاخ معطر' : 'Room Sprays', img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop" },
              { id: 'Home', title: lang === 'ar' ? 'قريباً' : 'Coming Soon', img: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=800&auto=format&fit=crop" },
              { id: 'Oil', title: lang === 'ar' ? 'قريباً' : 'Coming Soon', img: "https://images.unsplash.com/photo-1512777576244-b846ac3d816f?q=80&w=800&auto=format&fit=crop" },
            ].map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={cat.id === 'Spray' ? `/shop?category=${cat.id}` : "#"} className={`group block relative rounded-2xl overflow-hidden aspect-[16/9] shadow-lg ${cat.id !== 'Spray' ? 'cursor-not-allowed opacity-80' : ''}`}>
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-3xl font-display font-bold tracking-wide">{cat.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">{t.bestSellers.title}</h2>
            <Link href="/shop" className="text-primary font-medium hover:underline flex items-center gap-1">
              {t.bestSellers.viewAll}
            </Link>
          </div>

          {isLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full sm:w-1/2 lg:w-1/4 h-96 bg-muted animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16">{t.why.title}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { icon: Clock, title: t.why.c1, desc: t.why.d1 },
              { icon: Wallet, title: t.why.c2, desc: t.why.d2 },
              { icon: Sparkles, title: t.why.c3, desc: t.why.d3 },
              { icon: Gift, title: t.why.c4, desc: t.why.d4 },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <feature.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
