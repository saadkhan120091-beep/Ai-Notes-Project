import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lock, RefreshCw } from 'lucide-react';

export const ResetPasswordOverlay: React.FC = () => {
  const { isPasswordRecoveryMode, setPasswordRecoveryMode } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isPasswordRecoveryMode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Your password has been reset successfully!');
        setTimeout(() => {
          setPasswordRecoveryMode(false);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Update password error:', err);
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-[440px] px-6">
        
        {/* Glass Card */}
        <div className="relative overflow-hidden rounded-[36px] border border-white/60 bg-white/40 p-8 sm:p-10 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.12),0_10px_20px_-5px_rgba(0,0,0,0.06)] backdrop-blur-[50px]">
          
          {/* Specular Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
          
          <div className="flex flex-col items-center">
            {/* Header Icon */}
            <div className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-[24px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_12px_24px_-6px_rgba(99,102,241,0.4)] ring-4 ring-white/50">
               <RefreshCw size={36} className={loading ? 'animate-spin' : ''} strokeWidth={1.5} />
            </div>

            {/* Typography */}
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
              Create New Password
            </h2>
            <p className="mt-2 text-center text-sm font-medium text-slate-500 max-w-[280px]">
              Set your new secure password to access your AI workspace.
            </p>

            {success ? (
              <div className="mt-6 flex w-full flex-col items-center gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50/80 p-6 text-sm text-emerald-800 text-center backdrop-blur-md shadow-sm">
                <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">{success}</span>
                <span className="text-xs text-slate-500">Closing in a few seconds...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 w-full space-y-6">
                <div className="space-y-4">
                  <Input 
                    id="new-password"
                    label="New Password"
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password" 
                    icon={Lock}
                    className="bg-white/60 focus:bg-white"
                  />
                  <Input 
                    id="confirm-password"
                    label="Confirm New Password"
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password" 
                    icon={Lock}
                    className="bg-white/60 focus:bg-white"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200/60 bg-red-50/80 p-3.5 text-xs font-medium text-red-800 backdrop-blur-md">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="w-full h-[52px] text-[15px] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)]" 
                    isLoading={loading}
                  >
                    Update Password
                  </Button>
                  
                  <button
                    type="button"
                    onClick={() => setPasswordRecoveryMode(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline py-1 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
