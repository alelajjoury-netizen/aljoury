import { AuthForm } from '../../components/AuthForm';

export const metadata = { title: 'دخول | وَرَق' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const redirectTo = params.next === '/orders' ? '/orders' : '/';
  return <AuthForm mode="login" redirectTo={redirectTo} />;
}
