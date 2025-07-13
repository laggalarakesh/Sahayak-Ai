

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from '../services/firebase.ts';
import { SparklesIcon, EyeIcon, EyeSlashIcon } from './icons.tsx';

interface LoginProps {
  onSwitchView: (view: 'register' | 'forgotPassword') => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state change will handle redirect
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6">
          <SparklesIcon className="h-10 w-10 text-cyan-400 animate-pulse" />
          <h1 className="text-4xl font-orbitron text-cyan-400 ml-3">SahayakAI</h1>
        </div>
        <div className="bg-black/50 backdrop-blur-lg border border-purple-500/30 p-8 rounded-xl shadow-[0_0_20px_theme(colors.purple.700)]">
          <h2 className="text-2xl font-orbitron text-center text-white mb-6">Welcome Back</h2>
          {error && <p className="bg-pink-900/50 text-pink-300 p-3 rounded-md mb-4 text-sm font-mono">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-purple-300 block mb-2 font-orbitron">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-black/20 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 placeholder-purple-300/30 font-mono"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-purple-300 block mb-2 font-orbitron">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 bg-black/20 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 placeholder-purple-300/30 font-mono"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-400 hover:text-cyan-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-mono">
                Passwords must contain an uppercase letter, a lowercase letter, a number, and a special symbol.
              </p>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => onSwitchView('forgotPassword')}
                className="text-sm text-cyan-400 hover:underline font-mono"
              >
                Forgot password?
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg shadow-cyan-500/30 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6 font-mono">
            Don't have an account?{' '}
            <button onClick={() => onSwitchView('register')} className="font-medium text-cyan-400 hover:underline">
              Sign up
            </button>
          </p>
        </div>
        <div className="mt-10 pt-8 border-t border-purple-500/20 text-center">
            <p className="text-sm italic text-purple-300/70 max-w-lg mx-auto font-mono">
                SahayakAI is an AI-powered teaching assistant designed to help educators in India create lesson plans, worksheets, stories, and more.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;