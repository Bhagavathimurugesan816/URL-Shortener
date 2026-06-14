import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import UrlCard from '../components/UrlCard';
import CreateUrlModal from '../components/CreateUrlModal';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/urls')
      .then(res => setUrls(res.data))
      .catch(() => toast.error('Failed to load URLs'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = urls.filter(u =>
    u.longUrl.toLowerCase().includes(search.toLowerCase()) ||
    u.shortCode.toLowerCase().includes(search.toLowerCase())
  );

  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 animate-in">
          <h1 className="text-3xl font-extrabold text-white mb-1">Your Dashboard</h1>
          <p className="text-gray-400">Manage and track all your shortened links</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Links', value: urls.length, icon: '🔗', color: 'from-violet-600/20 to-violet-600/5', border: 'border-violet-500/20' },
            { label: 'Total Clicks', value: totalClicks, icon: '👆', color: 'from-teal-600/20 to-teal-600/5', border: 'border-teal-500/20' },
            { label: 'Active Today', value: urls.filter(u => new Date(u.updatedAt) > new Date(Date.now() - 86400000)).length, icon: '🟢', color: 'from-amber-600/20 to-amber-600/5', border: 'border-amber-500/20' },
          ].map((stat, i) => (
            <div key={stat.label} className={`glass rounded-2xl p-5 bg-gradient-to-br ${stat.color} ${stat.border} animate-in`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full glass rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
              placeholder="Search your links..."/>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold px-6 py-3 rounded-xl transition whitespace-nowrap glow-btn">
            + New Link
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3 animate-spin inline-block">⚡</div>
            <p>Loading your links...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl text-center py-16 text-gray-400 animate-in">
            <div className="text-5xl mb-4">🔗</div>
            <p className="text-lg font-medium">{search ? 'No URLs match your search' : 'No URLs yet. Create your first one!'}</p>
            {!search && (
              <button onClick={() => setShowModal(true)} className="mt-4 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl transition glow-btn">
                + Create Link
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(url => (
              <UrlCard key={url._id} url={url}
                onDelete={id => setUrls(urls.filter(u => u._id !== id))}
                onUpdate={updated => setUrls(urls.map(u => u._id === updated._id ? updated : u))}/>
            ))}
          </div>
        )}
      </div>

      {showModal && <CreateUrlModal onClose={() => setShowModal(false)} onCreated={url => setUrls([url, ...urls])}/>}
    </div>
  );
}