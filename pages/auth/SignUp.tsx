import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Command, Mail, Lock, User, Smile, CheckCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { RoutePath } from '../../types';
import { supabase } from '../../supabaseClient';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const fullName = formData.get('fullName') as string;
    const displayName = formData.get('displayName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            display_name: displayName,
          }
        }
      });

      if (error) {
        setError(error.message);
      } else if (!data?.session) {
        setSuccess('Check your email and confirm your account before logging in.');
      } else {
        navigate(RoutePath.HOME);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data?.url) {
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const authWindow = window.open(
          data.url,
          'SupabaseGoogleAuth',
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
        );

        if (!authWindow) {
          setError('Popup was blocked. Please allow popups for this site to sign in with Google.');
          setLoading(false);
          return;
        }

        const checkSessionInterval = setInterval(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            clearInterval(checkSessionInterval);
            authWindow.close();
            navigate(RoutePath.HOME);
          } else if (authWindow.closed) {
            clearInterval(checkSessionInterval);
            setError('Google sign-in was cancelled or closed.');
            setLoading(false);
          }
        }, 1000);
      } else {
        setError('Could not retrieve Google authentication URL');
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err?.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F4F6F9] font-sans selection:bg-indigo-500/20">
      
      {/* Cinematic Background - VisionOS Style */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
         {/* Animated Gradients */}
         <div className="absolute top-[-20%] right-[-10%] w-[90vw] h-[90vw] rounded-full bg-indigo-100/40 blur-[140px] mix-blend-multiply animate-pulse" style={{ animationDuration: '9s' }} />
         <div className="absolute bottom-[-20%] left-[-10%] w-[90vw] h-[90vw] rounded-full bg-sky-100/40 blur-[140px] mix-blend-multiply animate-pulse" style={{ animationDuration: '11s', animationDelay: '2s' }} />
         <div className="absolute top-[30%] right-[40%] w-[60vw] h-[60vw] rounded-full bg-violet-100/30 blur-[120px] mix-blend-multiply" />
         
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
      </div>

      {/* Main Container - Floating Effect */}
      <div className="relative w-full max-w-[440px] px-6 transition-all duration-700 ease-out hover:-translate-y-2">
        
        {/* Liquid Glass Card */}
        <div className="group relative overflow-hidden rounded-[36px] border border-white/60 bg-white/40 p-8 sm:p-10 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.08),0_10px_20px_-5px_rgba(0,0,0,0.04)] backdrop-blur-[50px] transition-all duration-500 hover:shadow-[0_45px_80px_-12px_rgba(0,0,0,0.12),0_15px_30px_-5px_rgba(0,0,0,0.06)] hover:bg-white/50">
          
          {/* Specular Top Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-100 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Header Icon */}
            <div className="mb-8 flex h-[72px] w-[72px] items-center justify-center rounded-[24px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_12px_24px_-6px_rgba(99,102,241,0.4)] ring-4 ring-white/50 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
               <Command size={36} strokeWidth={1.5} />
            </div>

            {/* Typography */}
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 drop-shadow-sm text-center">
              Create Account
            </h1>
            <p className="mt-2.5 text-[15px] font-medium text-slate-500 text-center max-w-[280px] leading-relaxed">
              Join the future of note-taking.
            </p>
          
            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-10 w-full space-y-6">
              <div className="space-y-4">
                <Input 
                  id="fullName"
                  name="fullName"
                  type="text" 
                  required
                  placeholder="Full Name" 
                  icon={User}
                  className="bg-white/60 focus:bg-white"
                />
                <Input 
                  id="displayName"
                  name="displayName"
                  type="text" 
                  required
                  placeholder="Display Name (e.g. Jane)" 
                  icon={Smile}
                  className="bg-white/60 focus:bg-white"
                />
                <Input 
                  id="email"
                  name="email"
                  type="email" 
                  autoComplete="email" 
                  required
                  placeholder="name@example.com" 
                  icon={Mail}
                  className="bg-white/60 focus:bg-white"
                />
                <Input 
                  id="password" 
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Create a password" 
                  icon={Lock}
                  className="bg-white/60 focus:bg-white"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-[52px] text-[15px] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] mt-2" 
                isLoading={loading}
              >
                Create Account
              </Button>
            </form>

            {/* Error Message Banner */}
            {error && (
               <div className="mt-4 flex w-full items-start gap-3 rounded-xl border border-red-200/60 bg-red-50/80 p-4 text-sm text-red-800 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-top-2">
                  <span className="font-medium leading-relaxed">{error}</span>
               </div>
            )}

            {/* Success Message Banner */}
            {success && (
               <div className="mt-4 flex w-full items-start gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/80 p-4 text-sm text-emerald-800 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-top-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <span className="font-medium leading-relaxed">{success}</span>
               </div>
            )}

            {/* Divider */}
             <div className="my-8 flex w-full items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white/30 px-2 py-1 rounded-md backdrop-blur-md border border-white/40">Or</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
             </div>

             {/* Social Button */}
             <Button 
                variant="secondary" 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-[52px] gap-3 bg-white/80 border-white shadow-sm hover:bg-white"
             >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12.0003 20.45c-4.6667 0-8.45-3.7833-8.45-8.45 0-4.6667 3.7833-8.45 8.45-8.45 2.1333 0 4.0833.7333 5.6333 1.95L15.4 8.0167c-1.0833-.8667-2.2833-1.3-3.4-1.3-3.05 0-5.5167 2.4667-5.5167 5.2833s2.4667 5.2833 5.5167 5.2833c2.6167 0 4.4333-1.5833 4.8833-4.0833h-4.8833v-2.8h7.95c.1.5167.15 1.05.15 1.6167 0 4.6333-3.1667 8.4333-8.1 8.4333z" fill="currentColor" />
                </svg>
                <span className="text-slate-700 font-semibold">Continue with Google</span>
             </Button>

             {/* Footer */}
             <p className="mt-8 text-[13px] text-slate-500 font-medium">
               Already have an account? <Link to={RoutePath.LOGIN} className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors hover:underline decoration-2 underline-offset-2">Sign in</Link>
             </p>

          </div>
        </div>

      </div>
    </div>
  );
};