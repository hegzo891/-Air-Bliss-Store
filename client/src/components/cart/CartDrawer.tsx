import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store";
import { ShoppingBag, X, Plus, Minus, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal, t, lang } = useAppStore();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setCartOpen(false);
    setLocation("/checkout");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent side={lang === 'ar' ? 'left' : 'right'} className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-2xl">
              <ShoppingBag className="w-6 h-6 text-primary" />
              {t.cart.title}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.cart.empty}</h3>
              <Button variant="outline" onClick={() => setCartOpen(false)} className="mt-4">
                {t.cart.continue}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full p-6">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={`${item.product.id}`} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-muted rounded-xl overflow-hidden shrink-0 border border-border/50">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="flex-1 flex flex-col py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm leading-tight line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
                        {item.price} {t.common.price}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-border rounded-lg bg-background">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-muted transition-colors rounded-l-lg"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-muted transition-colors rounded-r-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="font-bold text-primary">
                          {item.price * item.quantity} {t.common.price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="p-6 border-t bg-secondary/30 mt-auto">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>{t.cart.total}</span>
                <span className="text-primary">{cartTotal()} {t.common.price}</span>
              </div>

              <Button onClick={handleCheckout} className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20">
                {t.cart.checkout}
                <ArrowRight className={`w-5 h-5 ms-2 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
