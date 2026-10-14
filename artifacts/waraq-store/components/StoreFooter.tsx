import Link from 'next/link';

export function StoreFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">وَرَق</span>
          <span className="brand-tag">أخضر يجدد بيتك</span>
        </Link>
        <p className="footer-copy">
          نزرع لحظات خضراء في بيوت الكويت.
          <br />
          اختاري نبتتك القادمة، والباقي علينا.
        </p>
        <nav className="footer-links" aria-label="روابط المتجر">
          <Link href="/products">تسوقي النباتات</Link>
          <Link href="/orders">طلباتي</Link>
          <Link href="/login">دخول</Link>
        </nav>
      </div>
    </footer>
  );
}
