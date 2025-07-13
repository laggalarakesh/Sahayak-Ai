

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../services/firebase.ts';
import { SparklesIcon, EyeIcon, EyeSlashIcon } from './icons.tsx';

interface RegisterProps {
  onSwitchView: (view: 'login') => void;
}

const isPasswordStrong = (password: string): boolean => {
    const strongPasswordRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );
    return strongPasswordRegex.test(password);
};

const Register: React.FC<RegisterProps> = ({ onSwitchView }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Teacher');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
    }
    
    if (!isPasswordStrong(password)) {
        setError("Password is not strong enough. Please see the requirements below.");
        return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: fullName,
      });

      // Determine user role. Default to Admin for specific email.
      const userRole = email.toLowerCase() === 'laggalarakesh8@gmail.com' ? 'Admin' : role;

      // Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: fullName,
        email: email,
        role: userRole,
        createdAt: new Date()
      });

    } catch (err: any) {
      setError(err.message || 'Failed to create an account. Please try again.');
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
          <h2 className="text-2xl font-orbitron text-center text-white mb-6">Create an Account</h2>
          {error && <p className="bg-pink-900/50 text-pink-300 p-3 rounded-md mb-4 text-sm font-mono">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
             <div>
              <label htmlFor="full-name" className="text-sm font-medium text-purple-300 block mb-2 font-orbitron">Full Name</label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-black/20 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 placeholder-purple-300/30 font-mono"
                placeholder="e.g., Jane Doe"
                required
              />
            </div>
             <div>
                <label htmlFor="role" className="text-sm font-medium text-purple-300 block mb-2 font-orbitron">I am a</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 bg-black/20 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 font-mono"
                    required
                >
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                </select>
            </div>
            <div>
              <label htmlFor="email-reg" className="text-sm font-medium text-purple-300 block mb-2 font-orbitron">Email Address</label>
              <input
                id="email-reg"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-black/20 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 placeholder-purple-300/30 font-mono"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password-reg" className="text-sm font-medium text-purple-300 block mb-2 font-orbitron">Password</label>
              <div className="relative">
                <input
                  id="password-reg"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 bg-black/20 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 placeholder-purple-300/30 font-mono"
                  placeholder="••••••••"
                  required
                  aria-describedby="password-requirements"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-400 hover:text-cyan-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              <p id="password-requirements" className="text-xs text-gray-500 mt-2 font-mono">
                Must be 8+ chars, with uppercase, lowercase, number, and symbol (@$!%*?&).
              </p>
            </div>
             <div>
              <label htmlFor="confirm-password-reg" className="text-sm font-medium text-purple-300 block mb-2 font-orbitron">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirm-password-reg"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pr-10 bg-black/20 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 placeholder-purple-300/30 font-mono"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-400 hover:text-cyan-400"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg shadow-cyan-500/30 transition-all"
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6 font-mono">
            Already have an account?{' '}
            <button onClick={() => onSwitchView('login')} className="font-medium text-cyan-400 hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;