// pages/Register.jsx
//
// WHAT: The registration screen — name, email, password, confirm password.
// WHY: Entry point for new users. On success, logs them straight in
//      (backend returns a token on register) and sends them to onboarding
//      on the dashboard.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiActivity } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    if (!form.password) nextErrors.password = 'Password is required';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      toast.success('Account created!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center gap-2">
          <FiActivity className="text-2xl text-primary" />
          <h1 className="text-lg font-semibold text-white">Create your account</h1>
          <p className="text-sm text-slate-400">Start tracking your runs today</p>
        </div>

        {submitError && (
          <div className="mb-4">
            <ErrorMessage message={submitError} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Name"
            placeholder="Messi Sharma Upadhaya"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="upadhaya@example.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            error={errors.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />

          <Button type="submit" disabled={submitting} className="mt-1 w-full">
            {submitting ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
