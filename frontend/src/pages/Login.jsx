import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-teal-500 mb-4 text-3xl glow-btn">
            ⚡
          </div>
          <h1 className="text-4xl font-extrabold gradient-text">LinkSnap</h1>
          <p className="text-gray-400 mt-2">Shorten. Share. Track.</p>
        </div>
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-2">Sign in to your account</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#0f0f13]/80 border border-[#2e2e42] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input
              type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#0f0f13]/80 border border-[#2e2e42] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition glow-btn"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-center text-gray-400 text-sm">
            Don't have an account? <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-medium">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}