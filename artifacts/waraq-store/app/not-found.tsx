import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section empty-state" dir="rtl">
      <p className="section-kicker">لم نعثر على هذه الصفحة</p>
      <h1 className="section-title">قد تكون النبتة انتقلت لمكان آخر</h1>
      <Link className="button-primary" href="/">العودة إلى وَرَق</Link>
    </section>
  );
}
