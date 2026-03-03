## Packages
zustand | Global state management for shopping cart and i18n language toggle
framer-motion | Page transitions and scroll-triggered animations for a premium feel
lucide-react | Already in base, but emphasizing use for all iconography

## Notes
- Bilingual support requires rtl/ltr direction swapping. Tailwind logical properties (ps-4, me-4, text-start) are used extensively.
- WhatsApp ordering dynamically generates a wa.me link with the product details.
- Cart state is persisted via zustand to localStorage.
