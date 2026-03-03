import { useState } from "react";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { useCreateOrder } from "@/hooks/use-orders";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cart, cartTotal, lang, t, clearCart } = useAppStore();
  const createOrder = useCreateOrder();
  const { toast } = useToast();

  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    notes: ""
  });

  // Redirect if cart is empty and not on success screen
  if (cart.length === 0 && !success) {
    setLocation("/shop");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createOrder.mutate({
      user: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
      },
      city: formData.customerCity,
      address: formData.customerAddress,
      totalAmount: cartTotal(),
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        priceAtPurchase: item.price.toString()
      }))
    }, {
      onSuccess: () => {
        setSuccess(true);
        clearCart();
        window.scrollTo(0, 0);
        toast({
          title: "Order Placed Successfully",
          description: "Your order has been received and is being processed.",
          variant: "default",
        });
      },
      onError: (error: Error) => {
        let message = "Failed to place order. Please try again.";
        if (error.message.includes("User with this email already exists")) {
          message = "This email is already registered. Please use a different email or log in.";
        } else if (error.message.includes("User with this phone number already exists")) {
          message = "This phone number is already registered. Please use a different phone number.";
        } else if (error.message.includes("400")) {
          try {
            const parts = error.message.split(": ");
            if (parts.length > 1) {
              const json = JSON.parse(parts.slice(1).join(": "));
              message = json.message || message;
            }
          } catch (e) {
            // fallback to default message
          }
        }

        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    });
  };

  if (success) {
    return (
      <div className="pt-32 pb-20 min-h-[80vh] flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-8"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">{t.checkout.successTitle}</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {t.checkout.successMsg}
          </p>
          <button
            onClick={() => setLocation("/")}
            className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t.checkout.backHome}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setLocation("/shop")} className="p-2 bg-card rounded-full shadow-sm hover:shadow transition-shadow">
            <ArrowLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
          <h1 className="text-3xl font-display font-bold">{t.checkout.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Form */}
          <div className="lg:col-span-2">
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-6">{t.checkout.shipping}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t.checkout.name}</label>
                  <input required name="customerName" value={formData.customerName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t.checkout.email}</label>
                  <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t.checkout.phone}</label>
                  <input required type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t.checkout.city}</label>
                  <input required name="customerCity" value={formData.customerCity} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold">{t.checkout.address}</label>
                  <input required name="customerAddress" value={formData.customerAddress} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold">{t.checkout.notes}</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"></textarea>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">{t.checkout.payment}</h2>
              <div className="p-4 border-2 border-primary rounded-xl bg-primary/5 flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <span className="font-semibold text-lg">{t.checkout.cod}</span>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1 bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border sticky top-24">
            <h2 className="text-xl font-bold mb-6">{t.checkout.summary}</h2>

            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pe-2">
              {cart.map(item => (
                <div key={`${item.product.id}`} className="flex gap-4 items-center">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg bg-muted" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.quantity}x</p>
                  </div>
                  <div className="font-bold whitespace-nowrap text-sm">
                    {item.price * item.quantity} {t.common.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mb-8">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>{t.cart.total}</span>
                <span className="text-primary">{cartTotal()} {t.common.price}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={createOrder.isPending}
              className="w-full py-4 rounded-xl font-bold text-lg bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:pointer-events-none"
            >
              {createOrder.isPending ? "Processing..." : t.checkout.placeOrder}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
