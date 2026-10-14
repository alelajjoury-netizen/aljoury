import Link from 'next/link';
import { Heart, Leaf, Sparkles, Sprout } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { PlantDoctorExperience } from './PlantDoctorExperience';

export function StorefrontHome() {
  return (
    <>
      <section id="home" className="hero">
        <img
          className="hero-image"
          src="/waraq-hero.png"
          alt="نبتة مونستيرا في أصيص خزفي داخل منزل مضاء"
        />
        <div className="hero-content">
          <span className="eyebrow">مساحتك، بنَفَس أخضر</span>
          <h1>أحيِ مساحتك بطبيعة تنبض بالحياة</h1>
          <p>نباتات مختارة بعناية، وأصص مصنوعة يدوياً لتجعل كل زاوية أقرب للطبيعة.</p>
          <Link href="/products" className="button-primary">
            استكشف كولكشن النباتات <span aria-hidden="true">←</span>
          </Link>
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
          <div>
            <p className="section-kicker">مختارة لكِ من الطبيعة</p>
            <h2 className="section-title">أضيفي حياة إلى كل زاوية</h2>
          </div>
          <p className="section-copy">
            نباتات بيتية سهلة العناية، أصص خزفية وفخارية، وكل ما تحتاجه تربتك لتزدهر.
          </p>
        </div>
        <ProductGrid featuredOnly />
      </section>
      <PlantDoctorExperience />
      <section className="section story-section">
        <div className="story-image">
          <img src="/waraq-plants.png" alt="نباتات منزلية مختارة وأصص ورق اليدوية" />
          <div className="story-note">من بيوتنا إلى بيتك، بكل عناية</div>
        </div>
        <div className="story-copy">
          <span className="eyebrow">حكاية ورق</span>
          <h2>نؤمن أن البيت يزهر حين نعتني به</h2>
          <p>
            ورق متجر نباتات من الكويت، جمعنا فيه نباتات يسهل حبّها والاعتناء بها
            مع أصص يدوية تضيف لمسة شخصية لكل مساحة.
          </p>
          <Link href="/products" className="button-secondary">اكتشفي اختياراتنا</Link>
        </div>
      </section>
    </>
  );
}
