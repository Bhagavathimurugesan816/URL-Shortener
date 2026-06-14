import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/analytics/${id}`)
      .then(res => setData(res.data))
      .catch(() => { toast.error('Failed to load analytics'); navigate('/dashboard'); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400 text-center">
        <div className="text-4xl mb-3 animate-spin">⚡</div>
        <p>Loading analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition font-medium">
          ← Back to Dashboard
        </button>

        <div className="glass rounded-2xl p-6 mb-6 animate-in">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Short link</span>
              <a href={data.url.shortUrl} target="_blank" rel="noreferrer"
                className="block text-violet-300 font-extrabold text-xl hover:text-violet-200 mt-1">{data.url.shortUrl}</a>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-3 block">Destination</span>
              <p className="text-gray-300 mt-1 break-all">{data.url.longUrl}</p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-lg">
              <QRCodeSVG value={data.url.shortUrl} size={90}/>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Clicks', value: data.totalClicks, icon: '👆', color: 'from-violet-600/20 to-violet-600/5', border: 'border-violet-500/20' },
            { label: 'Last Visited', value: data.lastVisited ? new Date(data.lastVisited).toLocaleDateString() : 'Never', icon: '🕐', color: 'from-teal-600/20 to-teal-600/5', border: 'border-teal-500/20' },
            { label: 'Created', value: new Date(data.url.createdAt).toLocaleDateString(), icon: '📅', color: 'from-amber-600/20 to-amber-600/5', border: 'border-amber-500/20' },
          ].map((s, i) => (
            <div key={s.label} className={`glass rounded-2xl p-5 bg-gradient-to-br ${s.color} ${s.border} animate-in`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-extrabold text-white">{s.value}</div>
              <div className="text-gray-400 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6 mb-6 animate-in">
          <h2 className="text-white font-bold text-lg mb-4">Clicks — last 7 days</h2>
          {data.dailyClicks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.dailyClicks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e42"/>
                <XAxis dataKey="_id" stroke="#6b7280" tick={{ fontSize: 12 }}/>
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} allowDecimals={false}/>
                <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid #2e2e42', borderRadius: 12 }}/>
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass rounded-2xl p-6 animate-in">
          <h2 className="text-white font-bold text-lg mb-4">Recent visits</h2>
          {data.recentVisits.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No visits yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-[#2e2e42] uppercase text-xs tracking-wider">
                    <th className="text-left py-2 font-semibold">Time</th>
                    <th className="text-left py-2 font-semibold">Browser</th>
                    <th className="text-left py-2 font-semibold">OS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentVisits.map((v, i) => (
                    <tr key={i} className="border-b border-[#2e2e42]/50 text-gray-300">
                      <td className="py-2.5">{new Date(v.timestamp).toLocaleString()}</td>
                      <td className="py-2.5">{v.browser}</td>
                      <td className="py-2.5">{v.os}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}