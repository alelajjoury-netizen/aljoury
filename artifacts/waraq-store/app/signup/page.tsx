import { AuthForm } from '../../components/AuthForm';

export const metadata = { title: 'إنشاء حساب | وَرَق' };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
