// pages/Profile.jsx
//
// WHAT: Displays and edits the user's profile — name, email, height,
//       weight, age, gender. Weight in particular feeds into the calorie
//       calculation on both the backend and the live tracker.
// WHY: Lets users keep their info accurate. Uses PUT /api/auth/profile.

import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FiEdit2, FiUser, FiCamera } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { updateProfile as updateProfileApi, uploadProfilePhoto } from '../api/authApi';
import { fetchRuns } from '../api/runApi';
import { resolveFileUrl, calcStreakDays } from '../utils/formatters';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [streakDays, setStreakDays] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchRuns()
      .then(({ data }) => {
        if (!cancelled) setStreakDays(calcStreakDays(data.data));
      })
      .catch(() => {
        if (!cancelled) setStreakDays(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    height: user?.height ?? '',
    weight: user?.weight ?? '',
    age: user?.age ?? '',
    gender: user?.gender || '',
  });

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        height: form.height === '' ? null : Number(form.height),
        weight: form.weight === '' ? null : Number(form.weight),
        age: form.age === '' ? null : Number(form.age),
        gender: form.gender === '' ? null : form.gender,
      };

      const { data } = await updateProfileApi(payload);
      updateUser(data.data);
      toast.success('Profile updated');
      setEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }

    setUploadingPhoto(true);
    try {
      const { data } = await uploadProfilePhoto(file);
      updateUser(data.data);
      toast.success('Profile photo updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not upload photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const initials = (user?.name || '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Profile</h1>
        {!editing && (
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            <FiEdit2 /> Edit
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="mb-6 flex items-center gap-4">
          <div className="group relative h-16 w-16 flex-shrink-0">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-light text-lg font-semibold text-primary">
              {user?.profileImage ? (
                <img
                  src={resolveFileUrl(user.profileImage)}
                  alt={user?.name || 'Profile'}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials || <FiUser />
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              title="Change profile photo"
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-primary text-white shadow-card transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              <FiCamera size={12} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-base font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            {uploadingPhoto && <p className="text-xs text-primary">Uploading photo...</p>}
            {streakDays !== null && streakDays > 0 && (
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-orange-400">
                🔥 {streakDays} day{streakDays === 1 ? '' : 's'}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input label="Name" value={form.name} onChange={handleChange('name')} />
            <Input label="Email" type="email" value={form.email} onChange={handleChange('email')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Height (cm)" type="number" value={form.height} onChange={handleChange('height')} />
              <Input label="Weight (kg)" type="number" value={form.weight} onChange={handleChange('weight')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Age" type="number" value={form.age} onChange={handleChange('age')} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Gender</label>
                <select
                  value={form.gender}
                  onChange={handleChange('gender')}
                  className="rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-2 flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Update Profile'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Height</p>
              <p className="font-medium text-white">{user?.height ? `${user.height} cm` : '--'}</p>
            </div>
            <div>
              <p className="text-slate-400">Weight</p>
              <p className="font-medium text-white">{user?.weight ? `${user.weight} kg` : '--'}</p>
            </div>
            <div>
              <p className="text-slate-400">Age</p>
              <p className="font-medium text-white">{user?.age ?? '--'}</p>
            </div>
            <div>
              <p className="text-slate-400">Gender</p>
              <p className="font-medium capitalize text-white">{user?.gender ?? '--'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
