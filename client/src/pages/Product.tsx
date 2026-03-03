import { useParams } from "wouter";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useAppStore } from "@/lib/store";
import { ShoppingBag, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";

export default function Product() {
  const { id } = useParams();
  const { lang, t, addToCart } = useAppStore();
  const { data: product, isLoading } = useProduct(Number(id));
  const { data: allProducts } = useProducts();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center min-h-screen">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const name = product.name;
  const description = product.description;
  const related = allProducts?.filter(p => p.scentType === product.scentType && p.id !== product.id).slice(0, 3) || [];

  const currentPrice = Number(product.price) || 0;

  const handleAddToCart = () => {
    addToCart(product, currentPrice, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(`Hello Air Bliss! I want to order:\n${name}\nQuantity: ${quantity}\nPrice: ${currentPrice * quantity} EGP`);
    window.open(`https://wa.me/201000000000?text=${text}`, "_blank");
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-24">
          {/* Image Gallery */}
          <div className="rounded-3xl overflow-hidden bg-muted aspect-[4/5] relative">
            <img
              src={product.imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col py-6 md:py-10">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold uppercase tracking-wider">
                {product.scentType}
              </span>
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold uppercase tracking-wider">
                {product.scentType}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{name}</h1>
            <p className="text-3xl font-bold text-primary mb-8">
              {currentPrice} <span className="text-xl">{t.common.price}</span>
            </p>

            <p className="text-lg text-foreground/80 leading-relaxed mb-8">
              {description}
            </p>

            {/* Action Area */}
            <div className="mt-auto pt-6 border-t border-border/50">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center border-2 border-border rounded-xl bg-background overflow-hidden h-14">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 h-full hover:bg-muted transition-colors border-e border-border"
                  >
                    <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 h-full hover:bg-muted transition-colors border-s border-border"
                  >
                    <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 h-14 flex items-center justify-center gap-2 rounded-xl font-bold text-lg transition-all duration-300 ${added
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
                    }`}
                >
                  {added ? <Check className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
                  {added ? "Added!" : t.product.addToCart}
                </button>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full h-14 rounded-xl font-bold text-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all border border-[#25D366]/30 flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-6 h-6" />
                {t.product.whatsapp}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="pt-16 border-t border-border">
            <h2 className="text-3xl font-display font-bold mb-10 text-center">{t.product.related}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple internal icons
function SparklesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function WhatsAppIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
