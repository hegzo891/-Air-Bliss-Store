import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Filter, X } from "lucide-react";

export default function Shop() {
  const { t, lang } = useAppStore();

  // Parse query params for initial state
  const searchParams = new URLSearchParams(window.location.search);

  const [filters, setFilters] = useState({
    scentType: searchParams.get('scentType') || 'all',
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: products, isLoading } = useProducts(filters);

  // Update URL silently when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.scentType !== 'all') params.append('scentType', filters.scentType);

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ scentType: 'all' });
  };

  const filterSections = [
    {
      id: 'scentType',
      name: 'Scent Category',
      options: [
        { value: 'all', label: t.shop.all },
        { value: 'Refreshing', label: 'Refreshing' },
        { value: 'Floral', label: 'Floral' },
        { value: 'Woody', label: 'Woody' },
        { value: 'Oriental', label: 'Oriental' },
        { value: 'Neutral', label: 'Neutral' },
      ]
    }
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Header */}
        <div className="flex items-end justify-between border-b border-border pb-6 mb-8">
          <h1 className="text-4xl font-display font-bold">{t.shop.title}</h1>
          <button
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg font-medium"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter className="w-4 h-4" />
            {t.shop.filters}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`
            fixed md:static inset-0 z-50 bg-background md:bg-transparent p-6 md:p-0 
            transition-transform duration-300 md:translate-x-0
            w-full md:w-64 shrink-0 overflow-y-auto
            ${mobileFiltersOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')}
          `}>
            <div className="flex items-center justify-between md:hidden mb-6">
              <h2 className="text-xl font-bold">{t.shop.filters}</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {filterSections.map((section) => (
                <div key={section.id}>
                  <h3 className="font-semibold text-lg mb-4">{section.name}</h3>
                  <div className="space-y-3">
                    {section.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name={section.id}
                          value={option.value}
                          checked={filters[section.id as keyof typeof filters] === option.value}
                          onChange={(e) => updateFilter(section.id as keyof typeof filters, e.target.value)}
                          className="w-4 h-4 text-primary bg-background border-border focus:ring-primary/20 transition-all"
                        />
                        <span className={`text-sm ${filters[section.id as keyof typeof filters] === option.value ? 'text-primary font-medium' : 'text-foreground/80 group-hover:text-foreground'}`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={clearFilters}
                className="w-full py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors mt-8"
              >
                {t.shop.clear}
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-80 bg-muted animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.shop.empty}</h3>
                <button onClick={clearFilters} className="text-primary hover:underline">
                  {t.shop.clear}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
