

import React, { useState } from 'react';
import { sendPasswordResetEmail } from "@firebase/auth";
import { auth } from '../services/firebase.ts';
import { SparklesIcon } from './icons.tsx';

interface ForgotPasswordProps {
  onSwitchView: (view: 'login') => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchView }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
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
          <h2 className="text-2xl font-orbitron text-center text-white mb-2">Reset Password</h2>
          <p className="text-center text-sm text-purple-300/80 mb-6 font-mono">Enter your email to receive a reset link.</p>
          
          {error && <p className="bg-pink-900/50 text-pink-300 p-3 rounded-md mb-4 text-sm font-mono">{error}</p>}
          {message && <p className="bg-cyan-900/50 text-cyan-300 p-3 rounded-md mb-4 text-sm font-mono">{message}</p>}

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="email-forgot" className="text-sm font-medium text-purple-300 block mb-2 font-orbitron">Email Address</label>
              <input
                id="email-forgot"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-black/20 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 placeholder-purple-300/30 font-mono"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg shadow-cyan-500/30"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6 font-mono">
            Remembered your password?{' '}
            <button onClick={() => onSwitchView('login')} className="font-medium text-cyan-400 hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;