import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity } from 'react-icons/fi';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { forgotPassword } from '../api/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center gap-2">
          <FiActivity className="text-2xl text-primary" />
          <h1 className="text-lg font-semibold text-white">Forgot your password?</h1>
          <p className="text-center text-sm text-slate-400">
            Enter your account email and we&apos;ll send you a link to reset it.
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-accent-dark/40 bg-accent-light px-4 py-3 text-sm text-accent-dark">
            If an account with that email exists, a reset link has been sent. Check your inbox
            (and spam folder) — the link expires in 30 minutes.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <ErrorMessage message={error} />}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={submitting} className="mt-1 w-full">
              {submitting ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;