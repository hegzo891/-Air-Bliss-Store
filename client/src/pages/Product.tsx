import { useParams, Link } from "wouter";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useAppStore } from "@/lib/store";
import { ShoppingBag, ChevronLeft, ChevronRight, Check, ArrowLeft, Package, Droplets, Shield, Truck } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "framer-motion";

export default function Product() {
  const { id } = useParams();
  const { lang, t, addToCart } = useAppStore();
  const { data: product, isLoading } = useProduct(Number(id));
  const { data: allProducts } = useProducts();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 pt-8">
            {/* Image skeleton */}
            <div className="rounded-3xl bg-muted animate-pulse aspect-[4/5]" />
            {/* Details skeleton */}
            <div className="flex flex-col gap-4 py-10">
              <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
              <div className="h-12 w-3/4 bg-muted animate-pulse rounded-xl" />
              <div className="h-8 w-32 bg-muted animate-pulse rounded-lg" />
              <div className="h-24 w-full bg-muted animate-pulse rounded-xl mt-4" />
              <div className="h-14 w-full bg-muted animate-pulse rounded-xl mt-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-3">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const name = product.name;
  const description = product.description;
  const related = allProducts?.filter(p => p.scentType === product.scentType && p.id !== product.id).slice(0, 3) || [];

  const currentPrice = Number(product.price) || 0;
  const stockQty = product.quantityAvailable ?? 0;
  const isSoldOut = stockQty <= 0;
  const isLowStock = !isSoldOut && stockQty <= 5;

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(product, currentPrice, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(`Hello Air Bliss! I want to order:\n${name}\nQuantity: ${quantity}\nPrice: ${currentPrice * quantity} EGP`);
    window.open(`https://wa.me/201060435457?text=${text}`, "_blank");
  };

  const maxQuantity = isSoldOut ? 1 : stockQty;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8 pt-4"
        >
          <Link href="/" className="hover:text-foreground transition-colors">{t.nav.home}</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground transition-colors">{t.nav.shop}</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-24">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative group"
          >
            <div className="rounded-3xl overflow-hidden bg-muted aspect-[4/5] relative shadow-2xl shadow-black/10">
              {/* Image placeholder during load */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                  <Package className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
              <img
                src={product.imageUrl}
                alt={name}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => { setImageLoaded(true); (e.target as HTMLImageElement).style.display = 'none'; }}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Sold Out overlay on image */}
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="bg-red-600 text-white text-lg font-bold uppercase tracking-widest px-8 py-3 rounded-full shadow-2xl">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Floating scent badge on image */}
            {product.scentType && (
              <div className="absolute top-6 start-6 z-10">
                <span className="px-4 py-2 bg-white/90 dark:bg-card/90 text-foreground backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border border-border/30">
                  {product.scentType}
                </span>
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col py-2 md:py-6"
          >
            {/* Product title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">{name}</h1>

            {/* Price & Stock */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <p className={`text-3xl font-bold ${isSoldOut ? 'text-muted-foreground line-through' : 'text-primary'}`}>
                {currentPrice} <span className="text-lg font-semibold">{t.common.price}</span>
              </p>

              {isSoldOut ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600/10 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full border border-red-600/20">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 text-amber-600 text-sm font-bold rounded-full border border-amber-500/20">
                  Only {stockQty} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 text-sm font-bold rounded-full border border-emerald-500/20">
                  In Stock
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-base text-foreground/70 leading-relaxed mb-8">
                {description}
              </p>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Droplets, label: lang === 'ar' ? 'عطري طبيعي' : 'Natural Scent' },
                { icon: Shield, label: lang === 'ar' ? 'آمن للمنزل' : 'Home Safe' },
                { icon: Truck, label: lang === 'ar' ? 'شحن سريع' : 'Fast Delivery' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/50 border border-border/30 text-center">
                  <badge.icon className="w-5 h-5 text-primary" />
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Action Area */}
            <div className="mt-auto pt-6 border-t border-border/50 space-y-4">
              {/* Quantity + Add to Cart */}
              <div className="flex flex-wrap gap-3">
                <div className={`flex items-center border-2 border-border rounded-xl bg-background overflow-hidden h-14 ${isSoldOut ? 'opacity-40 pointer-events-none' : ''}`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 h-full hover:bg-muted transition-colors border-e border-border disabled:opacity-30"
                    disabled={isSoldOut || quantity <= 1}
                  >
                    <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(quantity + 1, maxQuantity))}
                    className="px-4 h-full hover:bg-muted transition-colors border-s border-border disabled:opacity-30"
                    disabled={isSoldOut || quantity >= maxQuantity}
                  >
                    <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className={`flex-1 h-14 flex items-center justify-center gap-2.5 rounded-xl font-bold text-lg transition-all duration-300 ${isSoldOut
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : added
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                >
                  {isSoldOut ? (
                    <>Sold Out</>
                  ) : added ? (
                    <><Check className="w-6 h-6" />Added!</>
                  ) : (
                    <><ShoppingBag className="w-6 h-6" />{t.product.addToCart}</>
                  )}
                </button>
              </div>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppOrder}
                disabled={isSoldOut}
                className={`w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all border ${isSoldOut
                  ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
                  : "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border-[#25D366]/30 hover:border-[#25D366]/50"
                  }`}
              >
                <WhatsAppIcon className="w-5 h-5" />
                {t.product.whatsapp}
              </button>

              {/* Subtotal preview */}
              {!isSoldOut && quantity > 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-center text-sm text-muted-foreground pt-1"
                >
                  Subtotal: <span className="font-bold text-foreground">{currentPrice * quantity} {t.common.price}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pt-16 border-t border-border"
          >
            <h2 className="text-3xl font-display font-bold mb-10 text-center">{t.product.related}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function WhatsAppIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
