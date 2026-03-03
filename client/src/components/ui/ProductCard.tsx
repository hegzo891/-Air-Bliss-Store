import { Link } from "wouter";
import type { ProductResponse } from "@shared/routes";
import { useAppStore } from "@/lib/store";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const { lang, t, addToCart } = useAppStore();

  const name = product.name;
  const description = product.description;
  const price = product.price;

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-md border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1">
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-muted/30">
        <img
          src={product.imageUrl}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {product.isBestSeller && (
          <span className="absolute top-4 start-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
            {t.bestSellers.title}
          </span>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3 gap-2">
          <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors flex-grow">
            <h3 className="font-display font-bold text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
          </Link>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-border/40">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold mb-1">
              {product.scentType}
            </span>
            <span className="font-bold text-lg text-foreground">
              {price} <span className="text-xs font-medium opacity-70">{t.common.price}</span>
            </span>
          </div>

          <button
            onClick={() => addToCart(product, Number(price), 1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-110 transition-all active:scale-95"
            title={t.product.addToCart}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
