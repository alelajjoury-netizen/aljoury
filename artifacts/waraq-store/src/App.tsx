import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/components/LegacyNotFound';
import { CartDrawer, type CartLine } from '@/components/CartDrawer';
import { PlantDoctor } from '@/components/PlantDoctor';
import { ProductCard, type Product } from '@/components/ProductCard';
import { Droplets, Heart, House, Leaf, MessageCircle, ShoppingBag, Sparkles, Sprout } from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const products: Product[] = [
  { id: 'monstera', name: 'مونستيرا دليسيوسا', category: 'plants', label: 'الأكثر طلباً', description: 'أوراق كبيرة تعطي حضوراً هادئاً للمكان.', price: 12, originalPrice: 14.5, care: 'سهلة العناية', wateringGuide: 'اسقيها عندما يجف أول 2–3 سم من التربة، عادةً كل 7–10 أيام. تفضّل ضوءاً ساطعاً غير مباشر.', art: 'monstera', colors: [{ name: 'طيني', hex: '#c87d55' }, { name: 'عاجي', hex: '#d9d3c3' }, { name: 'أخضر زيتوني', hex: '#78846d' }] },
  { id: 'snake', name: 'سانسيفيريا', category: 'plants', label: 'قليلة العناية', description: 'رفيقة صبورة تناسب المكتب أو غرفة النوم.', price: 8.75, care: 'سهلة جداً', wateringGuide: 'اتركي التربة تجف تماماً بين الريات، غالباً كل 2–3 أسابيع. تناسب الضوء الخفيف إلى الساطع غير المباشر.', art: 'snake', colors: [{ name: 'طيني', hex: '#c87d55' }, { name: 'رملي', hex: '#c4ae8e' }, { name: 'أخضر زيتوني', hex: '#78846d' }] },
  { id: 'pothos', name: 'بوتس معلّق', category: 'plants', label: 'اختيارنا', description: 'أوراق متدلية تضيف لمسة حياة للرفوف.', price: 7.25, care: 'سهلة العناية', wateringGuide: 'اسقيه عندما يجف سطح التربة، تقريباً كل 7–10 أيام. يحب الضوء المتوسط أو الساطع غير المباشر.', art: 'pothos', colors: [{ name: 'عاجي', hex: '#d9d3c3' }, { name: 'طيني', hex: '#c87d55' }, { name: 'أخضر زيتوني', hex: '#78846d' }] },
  { id: 'ceramic-pot', name: 'أصيص حكاية', category: 'pots', label: 'صناعة يدوية', description: 'سيراميك بملمس طبيعي، قطعة فريدة لكل نبتة.', price: 6.5, art: 'pot', colors: [{ name: 'طيني', hex: '#c87d55' }, { name: 'عاجي', hex: '#d9d3c3' }, { name: 'أخضر زيتوني', hex: '#78846d' }] },
  { id: 'terracotta-pot', name: 'أصيص التيراكوتا', category: 'pots', label: 'فخار محلي', description: 'فخار مسامي يساعد الجذور على التنفس.', price: 4.75, art: 'pot', colors: [{ name: 'طيني', hex: '#c87d55' }, { name: 'رملي', hex: '#c4ae8e' }] },
  { id: 'soil-kit', name: 'عدة عناية بالتربة', category: 'care', label: 'أساسيات العناية', description: 'مزيج تربة متوازن وأدوات بسيطة لبداية موفقة.', price: 5.25, art: 'kit' },
];

function Home() {
  const [category, setCategory] = useState<'all' | Product['category']>('all');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    if (!cartOpen && !doctorOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setCartOpen(false); setDoctorOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen, doctorOpen]);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const addToCart = (product: Product, color: string) => {
    setCart((items) => {
      const match = items.find((line) => line.product.id === product.id && line.color === color);
      return match
        ? items.map((line) => line.product.id === product.id && line.color === color ? { ...line, quantity: line.quantity + 1 } : line)
        : [...items, { product, color, quantity: 1 }];
    });
    setToast(`أُضيف ${product.name} إلى سلّتك`);
    setCartOpen(true);
  };
  const updateQuantity = (key: string, delta: number) => setCart((items) => items.map((line) => `${line.product.id}:${line.color}` === key ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0));
  const removeItem = (key: string) => setCart((items) => items.filter((line) => `${line.product.id}:${line.color}` !== key));
  const filteredProducts = category === 'all' ? products : products.filter((product) => product.category === category);
  const jumpTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setActiveNav(id); };
  const favoriteMessage = (name: string) => setToast(`تم تحديث المفضلة: ${name}`);

  return <div dir="rtl">
    <div className="announcement">توصيل مجاني للطلبات فوق 20 د.ك داخل الكويت</div>
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#home" aria-label="ورق، الصفحة الرئيسية" onClick={(event) => { event.preventDefault(); jumpTo('home'); }}>
          <span className="brand-mark">وَرَق <Leaf size={17} strokeWidth={1.5} aria-hidden="true" /></span><span className="brand-tag">أخضر يجدد بيتك</span>
        </a>
        <nav className="main-nav" aria-label="التنقل الرئيسي">
          <a href="#home" onClick={(event) => { event.preventDefault(); jumpTo('home'); }}>الرئيسية</a>
          <a href="#collection" onClick={(event) => { event.preventDefault(); jumpTo('collection'); }}>النباتات والأصص</a>
          <a href="#story" onClick={(event) => { event.preventDefault(); jumpTo('story'); }}>حكاية ورق</a>
          <button type="button" onClick={() => setDoctorOpen(true)}>طبيب النباتات</button>
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button" aria-label={`فتح سلتي، ${cartCount} منتجات`} onClick={() => setCartOpen(true)} data-testid="open-cart"><ShoppingBag size={20} />{cartCount > 0 && <span className="cart-count" aria-live="polite">{cartCount}</span>}</button>
        </div>
      </div>
    </header>

    <main>
      <section id="home" className="hero">
        <img className="hero-image" src="/waraq-hero.png" alt="نبتة مونستيرا في أصيص خزفي ضمن منزل مضاء" />
        <div className="hero-content">
          <span className="eyebrow">مساحتك، بنَفَس أخضر</span>
          <h1>أحيِ مساحتك بطبيعة تنبض بالحياة</h1>
          <p>نباتات مختارة بعناية، وأصص مصنوعة يدوياً لتجعل كل زاوية أقرب للطبيعة.</p>
          <button type="button" className="button-primary" onClick={() => jumpTo('collection')} data-testid="explore-collection">استكشف كولكشن النباتات <span aria-hidden="true">←</span></button>
        </div>
      </section>

      <div className="trust-strip" aria-label="مميزات ورق">
        <div className="trust-item"><Sprout size={18} /> نباتات مختارة بعناية</div>
        <div className="trust-item"><Heart size={17} /> ضمان نمو 30 يوماً</div>
        <div className="trust-item"><Heart size={17} /> أصص يدوية بحب</div>
        <div className="trust-item"><Leaf size={18} /> عناية تناسب المبتدئين</div>
        <div className="trust-item"><Sparkles size={17} /> توصيل لكل الكويت</div>
      </div>

      <section id="collection" className="section">
        <div className="section-head">
          <div><p className="section-kicker">مختارة لكِ من الطبيعة</p><h2 className="section-title">أضيفي حياة إلى كل زاوية</h2></div>
          <p className="section-copy">نباتات بيتية سهلة العناية، أصص خزفية وفخارية، وكل ما تحتاجه تربتك لتزدهر.</p>
        </div>
        <div className="category-tabs" role="group" aria-label="تصفية المنتجات">
          {[
            { id: 'all', label: 'كل المنتجات' }, { id: 'plants', label: 'نباتات داخلية' }, { id: 'pots', label: 'أصص يدوية' }, { id: 'care', label: 'عناية بالتربة' },
          ].map((item) => <button type="button" key={item.id} className={`category-tab${category === item.id ? ' active' : ''}`} aria-pressed={category === item.id} onClick={() => setCategory(item.id as typeof category)} data-testid={`filter-${item.id}`}>{item.label}</button>)}
        </div>
        <div className="product-grid" aria-live="polite">
          {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onFavorite={favoriteMessage} />)}
        </div>
      </section>

      <section className="consult-section" aria-label="استشارة طبيب النباتات">
        <div className="consult-copy">
          <p className="section-kicker">رفيقة خضراء على مقاسك</p>
          <h2>حائر أي نبتة تلائم غرفتك؟</h2>
          <p>جاوب على ثلاثة أسئلة بسيطة عن الضوء والمساحة، ونرشح لك نبتة تشبه بيتك وروتينك.</p>
          <button type="button" className="button-primary" onClick={() => setDoctorOpen(true)} data-testid="open-plant-doctor">اسأل طبيب النباتات <span aria-hidden="true">←</span></button>
        </div>
        <div className="consult-art"><img src="/waraq-plants.png" alt="مجموعة نباتات داخلية بأصص ترابية" /></div>
      </section>

      <section id="story" className="section story-section">
        <div className="story-image"><img src="/waraq-plants.png" alt="نباتات منزلية مختارة وأصص ورق اليدوية" /><div className="story-note">من بيوتنا إلى بيتك، بكل عناية</div></div>
        <div className="story-copy">
          <span className="eyebrow">حكاية ورق</span>
          <h2>نؤمن أن البيت يزهر حين نعتني به</h2>
          <p>ورق متجر نباتات من الكويت، جمعنا فيه نباتات يسهل حبّها والاعتناء بها مع أصص يدوية تضيف لمسة شخصية لكل مساحة. نختار كل نبتة لتكون بداية جميلة، لا اختباراً لخبرتك.</p>
          <div className="story-points"><span><Leaf size={16} /> اختيارات مناسبة للمناخ</span><span><Heart size={16} /> إرشاد من أول يوم</span></div>
          <button type="button" className="button-secondary" onClick={() => jumpTo('collection')} data-testid="browse-story-products">اكتشفي اختياراتنا <span aria-hidden="true">←</span></button>
        </div>
      </section>
    </main>
    <footer className="footer">
      <div className="footer-inner">
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); jumpTo('home'); }}><span className="brand-mark">وَرَق <Leaf size={17} strokeWidth={1.5} aria-hidden="true" /></span><span className="brand-tag">أخضر يجدد بيتك</span></a>
        <p className="footer-copy">نزرع لحظات خضراء في بيوت الكويت.<br />اختاري نبتتك القادمة، والباقي علينا.</p>
        <div className="footer-links"><a href="#collection" onClick={(event) => { event.preventDefault(); jumpTo('collection'); }}>تسوقي النباتات</a><a href="#story" onClick={(event) => { event.preventDefault(); jumpTo('story'); }}>عن ورق</a><button type="button" onClick={() => setDoctorOpen(true)} className="footer-link-button">طبيب النباتات</button></div>
      </div>
    </footer>
    <nav className="bottom-nav" aria-label="التنقل السفلي">
      <button type="button" className={activeNav === 'home' ? 'active' : ''} onClick={() => jumpTo('home')} data-testid="bottom-home"><House /><span>الرئيسية</span></button>
      <button type="button" className={activeNav === 'collection' ? 'active' : ''} onClick={() => jumpTo('collection')} data-testid="bottom-collection"><Leaf /><span>تسوقي</span></button>
      <button type="button" onClick={() => setDoctorOpen(true)} data-testid="bottom-doctor"><MessageCircle /><span>استشارة</span></button>
      <button type="button" onClick={() => setCartOpen(true)} data-testid="bottom-cart"><ShoppingBag />{cartCount > 0 && <span className="bottom-count" aria-live="polite">{cartCount}</span>}<span>سلتي</span></button>
    </nav>
    <CartDrawer open={cartOpen} lines={cart} onClose={() => setCartOpen(false)} onQuantity={updateQuantity} onRemove={removeItem} />
    <PlantDoctor open={doctorOpen} onClose={() => setDoctorOpen(false)} onAdd={addToCart} />
    {toast && <div className="toast-message" role="status" aria-live="polite" data-testid="status-feedback">{toast}</div>}
  </div>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;
