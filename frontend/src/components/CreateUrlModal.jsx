import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CreateUrlModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ longUrl: '', customAlias: '', expiresAt: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.longUrl) return setError('URL is required');
    setLoading(true);
    try {
      const payload = { longUrl: form.longUrl };
      if (form.customAlias.trim()) payload.customAlias = form.customAlias.trim();
      if (form.expiresAt) payload.expiresAt = form.expiresAt;
      const res = await api.post('/urls', payload);
      toast.success('Short URL created!');
      onCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="glass rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Create short URL</h2>
            <p className="text-gray-400 text-sm mt-0.5">Shorten any link in seconds</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2e2e42] transition">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Long URL *</label>
            <input value={form.longUrl}
              onChange={e => setForm({ ...form, longUrl: e.target.value })}
              className="w-full bg-[#0f0f13]/80 border border-[#2e2e42] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
              placeholder="https://example.com/very-long-url"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Custom alias <span className="text-gray-500 font-normal">(optional)</span></label>
            <div className="flex">
              <span className="bg-[#2e2e42] border border-r-0 border-[#2e2e42] rounded-l-xl px-3 py-3 text-gray-400 text-sm flex items-center">localhost:5000/</span>
              <input value={form.customAlias}
                onChange={e => setForm({ ...form, customAlias: e.target.value })}
                className="flex-1 bg-[#0f0f13]/80 border border-[#2e2e42] rounded-r-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                placeholder="my-alias"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Expiry date <span className="text-gray-500 font-normal">(optional)</span></label>
            <input type="datetime-local" value={form.expiresAt}
              onChange={e => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full bg-[#0f0f13]/80 border border-[#2e2e42] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"/>
          </div>
          {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-[#2e2e42] hover:bg-[#3e3e52] text-gray-300 py-3 rounded-xl font-semibold transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition glow-btn">
              {loading ? 'Creating...' : 'Create URL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}