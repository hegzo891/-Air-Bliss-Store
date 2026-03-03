import { useAppStore } from "@/lib/store";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const { lang } = useAppStore();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-4">
          {lang === 'ar' ? "تواصل معنا" : "Get in Touch"}
        </h1>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          {lang === 'ar' 
            ? "هل لديك سؤال حول منتجاتنا أو طلبك؟ نحن هنا للمساعدة. تواصل معنا وسنرد عليك في أقرب وقت ممكن."
            : "Have a question about our products or your order? We're here to help. Reach out to us and we'll respond as soon as possible."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">{lang === 'ar' ? "الاسم" : "Name"}</label>
                <input required className="w-full px-4 py-3 rounded-xl bg-secondary border-none focus:ring-2 focus:ring-primary/50 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{lang === 'ar' ? "البريد الإلكتروني" : "Email"}</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl bg-secondary border-none focus:ring-2 focus:ring-primary/50 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{lang === 'ar' ? "الرسالة" : "Message"}</label>
                <textarea required rows={5} className="w-full px-4 py-3 rounded-xl bg-secondary border-none focus:ring-2 focus:ring-primary/50 transition-all outline-none resize-none"></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:-translate-y-1 transition-transform flex items-center justify-center gap-2"
              >
                {sent ? (lang === 'ar' ? "تم الإرسال بنجاح!" : "Sent Successfully!") : (lang === 'ar' ? "إرسال الرسالة" : "Send Message")}
                {!sent && <Send className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />}
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center space-y-8 bg-primary/5 p-8 rounded-3xl border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shrink-0 shadow-sm">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{lang === 'ar' ? "رقم الهاتف / واتساب" : "Phone / WhatsApp"}</h3>
                <p className="text-muted-foreground">+20 100 000 0000</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shrink-0 shadow-sm">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{lang === 'ar' ? "البريد الإلكتروني" : "Email"}</h3>
                <p className="text-muted-foreground">hello@airbliss.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{lang === 'ar' ? "المقر" : "Location"}</h3>
                <p className="text-muted-foreground">{lang === 'ar' ? "القاهرة، مصر (متوفر توصيل لجميع المحافظات)" : "Cairo, Egypt (Nationwide delivery available)"}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
