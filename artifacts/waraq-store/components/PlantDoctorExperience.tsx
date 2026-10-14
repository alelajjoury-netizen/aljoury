'use client';

import { useState } from 'react';
import { Leaf, X } from 'lucide-react';
import { useCart } from './CartProvider';
import type { StoreProduct } from '../lib/types';

const questions = [
  {
    title: 'كم ضوء يصل إلى غرفتك؟',
    choices: ['ضوء ساطع غير مباشر', 'ضوء متوسط أو بعيد عن النافذة', 'ضوء قليل أغلب اليوم'],
  },
  {
    title: 'كيف تصفين روتينك مع النباتات؟',
    choices: ['أفضل ريّاً أسبوعياً منتظماً', 'أنسى الري أحياناً', 'أحب متابعة نباتاتي باستمرار'],
  },
  {
    title: 'أين ستضعينها؟',
    choices: ['على مكتب أو رف صغير', 'في زاوية أرضية واسعة', 'على طاولة جانبية'],
  },
];

function recommendationSlug(answers: string[]) {
  if (
    answers[0] === 'ضوء قليل أغلب اليوم' ||
    answers[1] === 'أنسى الري أحياناً' ||
    answers[2] === 'على مكتب أو رف صغير'
  ) return 'sansevieria';
  if (
    answers[2] === 'على طاولة جانبية' ||
    answers[0] === 'ضوء متوسط أو بعيد عن النافذة'
  ) return 'pothos';
  return 'monstera';
}

export function PlantDoctorExperience() {
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const close = () => {
    setOpen(false);
    setStep(0);
    setAnswers([]);
    setResult(null);
    setError('');
  };

  const finish = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('تعذر الحصول على توصية الآن.');
      const products = (await response.json()) as StoreProduct[];
      const product = products.find(
        (item) => item.slug === recommendationSlug(answers),
      );
      if (!product) throw new Error('لا تتوفر توصية مناسبة حالياً.');
      setResult(product);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'حدث خطأ غير متوقع.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="consult-section" aria-label="استشارة طبيب النباتات">
        <div className="consult-copy">
          <p className="section-kicker">رفيقة خضراء على مقاسك</p>
          <h2>حائر أي نبتة تلائم غرفتك؟</h2>
          <p>3 أسئلة قصيرة عن الضوء والمساحة وروتين الري تساعدنا على اختيار نبتتك.</p>
          <button
            type="button"
            className="button-primary"
            onClick={() => setOpen(true)}
            data-testid="open-plant-doctor"
          >
            اسأل طبيب النباتات <span aria-hidden="true">←</span>
          </button>
        </div>
        <div className="consult-art">
          <img src="/waraq-plants.png" alt="نباتات منزلية بأصص طبيعية" />
        </div>
      </section>
      {open && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <section
            className="quiz-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-title"
            dir="rtl"
          >
            <button
              type="button"
              className="icon-button quiz-close"
              aria-label="إغلاق طبيب النباتات"
              onClick={close}
              data-testid="close-plant-doctor"
            >
              <X size={20} />
            </button>
            {!result ? (
              <>
                <span className="eyebrow">طبيب النباتات</span>
                <div className="quiz-progress" aria-label={`السؤال ${step + 1} من 3`}>
                  {questions.map((question, index) => (
                    <span key={question.title} className={index <= step ? 'done' : ''} />
                  ))}
                </div>
                <span className="quiz-step-label">السؤال {step + 1} من 3</span>
                <h2 id="quiz-title">{questions[step].title}</h2>
                <div className="quiz-options" role="group" aria-label={questions[step].title}>
                  {questions[step].choices.map((choice) => (
                    <button
                      type="button"
                      key={choice}
                      className={`quiz-option${answers[step] === choice ? ' selected' : ''}`}
                      aria-pressed={answers[step] === choice}
                      onClick={() => {
                        const updated = [...answers];
                        updated[step] = choice;
                        setAnswers(updated);
                      }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                {error && <p className="error-message" role="alert">{error}</p>}
                <div className="quiz-controls">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => (step === 0 ? close() : setStep(step - 1))}
                  >
                    {step === 0 ? 'إلغاء' : 'السابق'}
                  </button>
                  <button
                    type="button"
                    className="button-primary"
                    disabled={!answers[step] || loading}
                    onClick={() => (step < 2 ? setStep(step + 1) : void finish())}
                    data-testid="quiz-next"
                  >
                    {loading ? 'جارٍ الاختيار…' : step < 2 ? 'التالي' : 'اكتشفي نبتتك'}
                  </button>
                </div>
              </>
            ) : (
              <div className="quiz-result">
                <div className="result-mark"><Leaf size={30} /></div>
                <span className="quiz-step-label">اقتراحنا لك</span>
                <h2 id="quiz-title">{result.name}</h2>
                <p>{result.description}</p>
                <div className="quiz-controls">
                  <button type="button" className="button-secondary" onClick={close}>إغلاق</button>
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => {
                      add(result, result.potColors[0] ?? { name: 'طيني', hex: '#c87d55' });
                      close();
                    }}
                  >
                    أضيفيها إلى السلّة
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
