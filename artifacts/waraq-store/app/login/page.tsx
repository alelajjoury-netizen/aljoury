import { AuthForm } from '../../components/AuthForm';

export const metadata = { title: 'دخول | وَرَق' };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
