import { redirect } from 'next/navigation';

export default function ForgottenPasswordRedirect() {
  redirect('/auth/forgotten-password');
} 