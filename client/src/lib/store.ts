import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductResponse } from '@shared/routes';

type Language = 'en' | 'ar';

// --- TRANSLATIONS ---
const dictionary = {
  en: {
    nav: { home: "Home", shop: "Shop", about: "About Us", contact: "Contact" },
    hero: { title: "Pure Air. Pure Bliss.", subtitle: "Transform your environment with our artisanal room sprays and essential oils. Designed for sensory purity and long-lasting freshness.", cta: "Explore Scents" },
    categories: { title: "Discover Freshness", forHim: "Refreshing", forHer: "Floral", unisex: "Earthy", air: "Coming Soon" },
    bestSellers: { title: "Bestselling Scents", viewAll: "All Scents" },
    why: {
      title: "The Air Bliss Promise",
      c1: "Odor Neutralizing", d1: "Scientifically formulated to clear the air, naturally.",
      c2: "Home Safe", d2: "Pet and child-friendly ingredients for peace of mind.",
      c3: "Botanical Extracts", d3: "Crafted with pure essential oils and floral waters.",
      c4: "Elegant Design", d4: "Minimalist bottles that add a touch of class to any room."
    },
    shop: { title: "Our Scent Collection", filters: "Filter", all: "All", gender: "Scent Family", category: "Delivery Method", clear: "Reset", empty: "No fresheners found matching your filters." },
    product: { addToCart: "Add to Bag", whatsapp: "Inquiry Concierge", notes: "Scent Profile", top: "Initial", heart: "Body", base: "Lingering", related: "Complementary Aromas" },
    cart: { title: "Your Cart", empty: "Your cart is empty", total: "Total", checkout: "Secure Checkout", continue: "Continue Shopping" },
    checkout: {
      title: "Checkout", summary: "Order Summary", shipping: "Shipping Details",
      name: "Full Name", email: "Email Address", phone: "Phone Number", address: "Street Address", city: "City", notes: "Order Notes (Optional)",
      payment: "Payment Method", cod: "Cash on Delivery", placeOrder: "Place Order",
      successTitle: "Order Confirmed!", successMsg: "Thank you for choosing Air Bliss. We will contact you shortly to confirm your delivery.", backHome: "Back to Home"
    },
    common: { price: "EGP" }
  },
  ar: {
    nav: { home: "الرئيسية", shop: "المتجر", about: "من نحن", contact: "تواصل معنا" },
    hero: { title: "هواء نقي. سعادة غامرة.", subtitle: "حول بيئتك مع بخاخاتنا الفاخرة وزيوتنا العطرية. صممت لنقاء الحواس وانتعاش يدوم طويلاً.", cta: "اكتشف الروائح" },
    categories: { title: "اكتشف الانتعاش", forHim: "منعش", forHer: "زهري", unisex: "ترابي", air: "قريباً" },
    bestSellers: { title: "الأكثر مبيعاً", viewAll: "جميع الروائح" },
    why: {
      title: "وعد إير بليس",
      c1: "مزيل للروائح", d1: "تركيبة علمية لتنقية الهواء بشكل طبيعي.",
      c2: "آمن للمنزل", d2: "مكونات آمنة للحيوانات الأليفة والأطفال لراحة بالك.",
      c3: "خلاصات نباتية", d3: "مصنوع من زيوت عطرية نقية ومياه عطرية.",
      c4: "تصميم أنيق", d4: "زجاجات بسيطة تضيف لمسة من الرقي لأي غرفة."
    },
    shop: { title: "مجموعة الروائح", filters: "تصفية", all: "الكل", gender: "عائلة الرائحة", category: "طريقة الاستخدام", clear: "إعادة تعيين", empty: "لم يتم العثور على معطرات مطابقة للفلاتر." },
    product: { addToCart: "أضف للحقيبة", whatsapp: "خدمة العملاء", notes: "ملف الرائحة", top: "الافتتاحية", heart: "القلب", base: "الأثر", related: "روائح مكملة" },
    cart: { title: "سلة التسوق", empty: "السلة فارغة", total: "المجموع", checkout: "إتمام الطلب", continue: "متابعة التسوق" },
    checkout: {
      title: "إتمام الطلب", summary: "ملخص الطلب", shipping: "تفاصيل الشحن",
      name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف", address: "عنوان الشارع", city: "المدينة", notes: "ملاحظات الطلب (اختياري)",
      payment: "طريقة الدفع", cod: "الدفع عند الاستلام", placeOrder: "تأكيد الطلب",
      successTitle: "تم تأكيد الطلب!", successMsg: "شكراً لاختيارك إير بليس. سنتواصل معك قريباً لتأكيد التوصيل.", backHome: "العودة للرئيسية"
    },
    common: { price: "ج.م" }
  }
};

interface CartItem {
  product: ProductResponse;
  quantity: number;
  price: number;
}

interface AppState {
  // i18n
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof dictionary.en;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  addToCart: (product: ProductResponse, price: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: 'en',
      setLang: (lang) => {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        set({ lang, t: dictionary[lang] });
      },
      t: dictionary.en,

      cart: [],
      isCartOpen: false,
      setCartOpen: (isCartOpen) => set({ isCartOpen }),

      addToCart: (product, price, quantity = 1) => set((state) => {
        const existing = state.cart.find(item => item.product.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(item =>
              (item.product.id === product.id)
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isCartOpen: true
          };
        }
        return { cart: [...state.cart, { product, price, quantity }], isCartOpen: true };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => !(item.product.id === productId))
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          (item.product.id === productId) ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),

      clearCart: () => set({ cart: [] }),

      cartTotal: () => get().cart.reduce((total, item) => total + (item.price * item.quantity), 0),
      cartCount: () => get().cart.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'airbliss-storage',
      partialize: (state) => ({ cart: state.cart, lang: state.lang }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
          state.t = dictionary[state.lang];
        }
      }
    }
  )
);
