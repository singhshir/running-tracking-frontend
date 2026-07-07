import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiActivity } from 'react-icons/fi';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!password) nextErrors.password = 'New password is required';
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await resetPassword(token, password);
      toast.success('Password reset! You are now logged in.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'This reset link is invalid or has expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center gap-2">
          <FiActivity className="text-2xl text-primary" />
          <h1 className="text-lg font-semibold text-white">Set a new password</h1>
          <p className="text-center text-sm text-slate-400">Choose a new password for your account.</p>
        </div>

        {submitError && (
          <div className="mb-4">
            <ErrorMessage message={submitError} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="New password"
            type="password"
            placeholder="••••••••"
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirm new password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            error={errors.confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" disabled={submitting} className="mt-1 w-full">
            {submitting ? 'Resetting...' : 'Reset password'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/login" className="font-medium text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;