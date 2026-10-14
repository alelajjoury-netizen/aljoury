import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Leaf, X } from 'lucide-react';
import type { Product } from './ProductCard';

type Props = { open: boolean; onClose: () => void; onAdd: (product: Product, color: string) => void };
const questions = [
  { title: 'كم ضوء يصل إلى غرفتك؟', hint: 'فكري في المكان الذي ستعيش فيه النبتة.', options: ['ضوء ساطع غير مباشر', 'ضوء متوسط أو بعيد عن النافذة', 'ضوء قليل أغلب اليوم'] },
  { title: 'كيف تصفين روتينك مع النباتات؟', hint: 'نختار لك نبتة تناسب وقتك، بلا ضغط.', options: ['أفضل ريّاً أسبوعياً منتظماً', 'أنسى الري أحياناً', 'أحب متابعة نباتاتي باستمرار'] },
  { title: 'أين ستضعينها؟', hint: 'المساحة تساعدنا على اقتراح الحجم الأنسب.', options: ['على مكتب أو رف صغير', 'في زاوية أرضية واسعة', 'على طاولة جانبية'] },
];
const recommendations: Record<string, { name: string; reason: string; id: string }> = {
  monstera: { name: 'مونستيرا دليسيوسا', reason: 'تحب الضوء الساطع غير المباشر وتناسب روتين الري المنتظم والمساحات الأرضية الواسعة.', id: 'monstera' },
  pothos: { name: 'بوتس معلّق', reason: 'أوراقه المتدلية تحب الضوء الساطع غير المباشر وتناسب الرفوف والمساحات الصغيرة.', id: 'pothos' },
  snake: { name: 'سانسيفيريا', reason: 'اختيار صبور للأماكن قليلة الضوء، ويتحمل نسيان الري ويناسب المكتب أو غرفة النوم.', id: 'snake' },
};

function recommendPlant(answers: string[]) {
  if (answers[0] === 'ضوء قليل أغلب اليوم' || answers[1] === 'أنسى الري أحياناً' || answers[2] === 'على مكتب أو رف صغير') {
    return recommendations.snake;
  }
  if (answers[2] === 'على طاولة جانبية' || answers[0] === 'ضوء متوسط أو بعيد عن النافذة') {
    return recommendations.pothos;
  }
  return recommendations.monstera;
}

export function PlantDoctor({ open, onClose, onAdd }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const selected = answers[step];
  const recommendation = recommendPlant(answers);
  const recommendedProduct: Product = {
    id: recommendation.id, name: recommendation.name, category: 'plants', label: 'اختيار الطبيب',
    description: recommendation.reason, price: recommendation.id === 'snake' ? 8.75 : recommendation.id === 'monstera' ? 12 : 7.25,
    care: 'سهلة العناية', art: recommendation.id === 'snake' ? 'snake' : recommendation.id === 'pothos' ? 'pothos' : 'monstera',
    colors: [{ name: 'طيني', hex: '#c87d55' }],
  };
  const choose = (choice: string) => {
    const updated = [...answers];
    updated[step] = choice;
    setAnswers(updated);
  };
  return <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="quiz-modal" role="dialog" aria-modal="true" aria-labelledby="quiz-title" dir="rtl">
      <button type="button" className="icon-button quiz-close" aria-label="إغلاق طبيب النباتات" onClick={onClose} data-testid="close-plant-doctor"><X size={20} /></button>
      {!result ? <>
        <span className="eyebrow">طبيب النباتات</span>
        <div className="quiz-progress" aria-label={`السؤال ${step + 1} من 3`}>{questions.map((_, index) => <span key={index} className={index <= step ? 'done' : ''} />)}</div>
        <span className="quiz-step-label">السؤال {step + 1} من 3</span>
        <h2 id="quiz-title">{questions[step].title}</h2><p className="quiz-hint">{questions[step].hint}</p>
        <div className="quiz-options" role="group" aria-label={questions[step].title}>{questions[step].options.map((option) => <button key={option} type="button" className={`quiz-option${selected === option ? ' selected' : ''}`} aria-pressed={selected === option} onClick={() => choose(option)} data-testid={`quiz-option-${step}-${questions[step].options.indexOf(option)}`}>{option}{selected === option && <Check size={17} />}</button>)}</div>
        <div className="quiz-controls">
          <button type="button" className="button-secondary" onClick={() => step === 0 ? onClose() : setStep(step - 1)} data-testid="quiz-back">{step === 0 ? 'إلغاء' : <><ArrowRight size={15} /> السابق</>}</button>
          <button type="button" className="button-primary" disabled={!selected} onClick={() => step < 2 ? setStep(step + 1) : setResult(true)} data-testid="quiz-next">{step < 2 ? <>التالي <ArrowLeft size={15} /></> : 'اكتشفي نبتتك'}</button>
        </div>
      </> : <div className="quiz-result">
        <div className="result-mark"><Leaf size={30} /></div>
        <span className="quiz-step-label">اقتراحنا لك</span><h2 id="quiz-title">نبتتك الأقرب إليك</h2>
        <h3>{recommendation.name}</h3><p>{recommendation.reason}</p>
        <div className="quiz-controls"><button type="button" className="button-secondary" onClick={() => { setResult(false); setStep(0); setAnswers([]); }} data-testid="quiz-restart">ابدئي من جديد</button><button type="button" className="button-primary" onClick={() => { onAdd(recommendedProduct, '#c87d55'); onClose(); }} data-testid="quiz-add-recommendation">أضيفيها إلى السلّة</button></div>
      </div>}
    </section>
  </div>;
}
