import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function PublicStats() {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/public/${shortCode}`)
      .then(res => setData(res.data))
      .catch(() => setError('This short link does not exist.'))
      .finally(() => setLoading(false));
  }, [shortCode]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-teal-500 mb-4 text-3xl glow-btn">
            ⚡
          </div>
          <h1 className="text-4xl font-extrabold gradient-text">LinkSnap</h1>
          <p className="text-gray-400 mt-2">Public Link Stats</p>
        </div>

        {loading ? (
          <div className="glass rounded-3xl p-8 text-center text-gray-400">
            <div className="text-3xl animate-spin mb-2">⚡</div>
            Loading...
          </div>
        ) : error ? (
          <div className="glass rounded-3xl p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-300 font-medium">{error}</p>
            <Link to="/login" className="inline-block mt-4 text-violet-400 hover:text-violet-300 font-medium">Go to LinkSnap →</Link>
          </div>
        ) : (
          <div className="glass rounded-3xl p-8 space-y-5">
            <div className="text-center">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Short Link</span>
              <p className="text-violet-300 font-extrabold text-xl mt-1 break-all">{data.shortUrl}</p>
              {data.isExpired && (
                <span className="inline-block mt-2 text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-medium">⏰ Expired</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-gradient-to-br from-violet-600/20 to-violet-600/5 border border-violet-500/20 rounded-2xl p-5 text-center">
                <div className="text-2xl mb-1">👆</div>
                <div className="text-2xl font-extrabold text-white">{data.totalClicks}</div>
                <div className="text-gray-400 text-xs font-medium">Total Clicks</div>
              </div>
              <div className="bg-gradient-to-br from-teal-600/20 to-teal-600/5 border border-teal-500/20 rounded-2xl p-5 text-center">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-sm font-extrabold text-white">{new Date(data.createdAt).toLocaleDateString()}</div>
                <div className="text-gray-400 text-xs font-medium">Created</div>
              </div>
            </div>

            <p className="text-center text-gray-500 text-xs pt-2">
              Powered by <span className="text-violet-400 font-semibold">LinkSnap</span> — no login required to view public stats
            </p>
          </div>
        )}
      </div>
    </div>
  );
}