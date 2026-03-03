import { useAppStore } from "@/lib/store";

export default function About() {
  const { lang } = useAppStore();

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
          {lang === 'ar' ? "عن إير بليس" : "About Air Bliss"}
        </h1>

        <div className="prose prose-lg mx-auto prose-primary">
          {/* interior decor freshener photography */}
          <img 
            src="https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=1200&auto=format&fit=crop" 
            alt="Air Bliss Lifestyle" 
            className="w-full h-[400px] object-cover rounded-3xl mb-12 shadow-md"
          />

          <p className="text-xl leading-relaxed text-foreground/80 mb-8">
            {lang === 'ar' 
              ? "بدأت إير بليس برؤية بسيطة: مساعدة الجميع على التنفس بعمق. نحن نؤمن بأن الهواء في منزلك يجب أن يكون تجربة منعشة." 
              : "Air Bliss started with a simple vision: to help everyone Breathe Easy. We believe that the air in your home should be a refreshing experience."}
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">{lang === 'ar' ? "مهمتنا" : "Our Mission"}</h2>
          <p className="text-foreground/80 leading-relaxed mb-8">
            {lang === 'ar' 
              ? "نسعى لتقديم معطرات جو عالية الجودة، بتركيبات متطورة تقضي على الروائح ولا تكتفي بإخفائها، مصممة للسوق المصري مع التركيز على النقاء والاستدامة."
              : "We strive to deliver high-quality air fresheners with advanced formulas that eliminate odors, not just mask them, tailored for the Egyptian market with a focus on purity and sustainability."}
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">{lang === 'ar' ? "فهم منتجاتنا" : "Understanding Our Products"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-secondary p-6 rounded-2xl">
              <h3 className="font-bold text-lg mb-2">Room Sprays</h3>
              <p className="text-sm text-foreground/70">
                {lang === 'ar' ? "بخاخ منعش بتوازن مثالي للانتشار الفوري. مثالي لتغيير جو أي غرفة بلحظات." : "Refreshing sprays with perfect balance for immediate diffusion. Ideal for instantly transforming any room."}
              </p>
            </div>
            <div className="bg-secondary p-6 rounded-2xl">
              <h3 className="font-bold text-lg mb-2">Essential Oils</h3>
              <p className="text-sm text-foreground/70">
                {lang === 'ar' ? "زيوت نقية بتركيز عالي. تدوم لفترات طويلة وتوفر رائحة هادئة ومستمرة." : "Pure oils with high concentration. Long-lasting and providing a calm, continuous scent."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
