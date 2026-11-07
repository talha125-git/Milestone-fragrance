import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { logo } from '../assets';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Try backend authentication first
      let authSuccessful = false;
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            authSuccessful = true;
          }
        }
      } catch {
        // Fallback to local check if backend isn't reachable
      }

      // Check credentials: admin / admin123
      if (authSuccessful || (username.trim() === 'admin' && password === 'admin123')) {
        const sessionData = {
          username: 'admin',
          name: 'Milestone Administrator',
          role: 'superadmin',
          loginTime: new Date().toISOString(),
        };

        if (rememberMe) {
          localStorage.setItem('milestone_admin_auth', 'true');
          localStorage.setItem('milestone_admin_user', JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem('milestone_admin_auth', 'true');
          sessionStorage.setItem('milestone_admin_user', JSON.stringify(sessionData));
        }

        if (onLoginSuccess) {
          onLoginSuccess(sessionData);
        }

        // Redirect to admin dashboard
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid username or password. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0908] flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#dfb76c] selection:text-black">
      {/* Background ambient luxury lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(223,183,108,0.15)_0%,rgba(180,120,40,0.05)_50%,transparent_75%)] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(223,183,108,0.12)_0%,rgba(180,120,40,0.04)_50%,transparent_75%)] blur-3xl pointer-events-none" />

      {/* Back to Storefront Link */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-xs text-stone-400 hover:text-[#dfb76c] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </button>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md z-10">
        {/* Glow Frame */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[#dfb76c]/30 via-transparent to-[#dfb76c]/10 blur-md pointer-events-none" />

        <div className="relative bg-[#12100d] border border-[#2b241c] rounded-2xl p-6 sm:p-9 shadow-2xl backdrop-blur-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src={logo}
                alt="Milestone Fragrances"
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(223,183,108,0.2)]"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#1b1712] border border-[#dfb76c]/30 text-[#dfb76c] text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal Access</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal">
              Executive Sign In
            </h1>
            <p className="text-stone-400 text-xs mt-1.5">
              Enter your administrative credentials to manage products, inventory & orders.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-950/60 border border-red-800/60 text-red-300 text-xs p-3.5 rounded-lg flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-[#181410] border border-[#2b241c] focus:border-[#dfb76c] text-white text-xs sm:text-sm rounded-lg pl-10 pr-4 py-3 placeholder-stone-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-[#181410] border border-[#2b241c] focus:border-[#dfb76c] text-white text-xs sm:text-sm rounded-lg pl-10 pr-10 py-3 placeholder-stone-600 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Quick Hint */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-400 hover:text-stone-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#2b241c] bg-[#181410] text-[#dfb76c] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Keep me signed in</span>
              </label>

              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[#dfb76c] hover:underline text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill Demo Admin</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#dfb76c] hover:bg-[#caa053] active:scale-[0.99] text-[#0d0c0a] font-semibold text-xs sm:text-sm py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <span>Sign In to Dashboard &rarr;</span>
                )}
              </button>
            </div>
          </form>

          {/* Credential Reference Pill */}
          <div className="mt-6 pt-5 border-t border-[#201b16] text-center">
            <div className="inline-block bg-[#161310] border border-[#2b241c] rounded-md px-3 py-1.5 text-[11px] text-stone-400">
              Username: <strong className="text-[#dfb76c]">admin</strong> &nbsp;|&nbsp; Password: <strong className="text-[#dfb76c]">admin123</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

