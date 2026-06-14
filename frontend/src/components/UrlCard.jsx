import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function UrlCard({ url, onDelete, onUpdate }) {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(url.longUrl);
  const [deleting, setDeleting] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url.shortUrl);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this URL?')) return;
    setDeleting(true);
    try {
      await api.delete(`/urls/${url._id}`);
      toast.success('URL deleted');
      onDelete(url._id);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/urls/${url._id}`, { longUrl: newUrl });
      toast.success('URL updated');
      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Update failed');
    }
  };

  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();

  return (
    <div className={`glass rounded-2xl p-5 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-500/10 animate-in ${isExpired ? 'border-red-500/30 opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/30 to-teal-500/30 flex items-center justify-center text-sm border border-violet-500/20">
              🔗
            </div>
            <a href={url.shortUrl} target="_blank" rel="noreferrer"
              className="text-violet-300 font-bold hover:text-violet-200 truncate text-base">
              {url.shortUrl}
            </a>
            {isExpired && <span className="text-xs bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full font-medium">Expired</span>}
          </div>
          {editing ? (
            <div className="flex gap-2 mt-2 ml-10">
              <input value={newUrl} onChange={e => setNewUrl(e.target.value)}
                className="flex-1 bg-[#0f0f13]/80 border border-violet-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"/>
              <button onClick={handleUpdate} className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-2 rounded-lg font-medium transition">Save</button>
              <button onClick={() => setEditing(false)} className="text-xs bg-[#2e2e42] text-gray-300 px-3 py-2 rounded-lg font-medium transition">Cancel</button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm truncate ml-10">{url.longUrl}</p>
          )}
          <div className="flex items-center gap-4 mt-3 ml-10 text-xs text-gray-500">
            <span className="flex items-center gap-1">📅 {new Date(url.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1 text-teal-400 font-semibold">👆 {url.clicks} clicks</span>
            {url.expiresAt && <span className="flex items-center gap-1">⏰ Expires {new Date(url.expiresAt).toLocaleDateString()}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={copy} title="Copy" className="text-xs bg-[#2e2e42] hover:bg-violet-600/30 hover:text-violet-300 text-gray-300 px-3 py-2 rounded-xl transition font-medium">Copy</button>
          <button onClick={() => navigate(`/analytics/${url._id}`)} title="Analytics" className="text-xs bg-[#2e2e42] hover:bg-teal-600/30 hover:text-teal-300 text-gray-300 px-3 py-2 rounded-xl transition font-medium">Stats</button>
          <button onClick={() => setEditing(!editing)} title="Edit" className="text-xs bg-[#2e2e42] hover:bg-amber-600/30 hover:text-amber-300 text-gray-300 px-3 py-2 rounded-xl transition font-medium">Edit</button>
          <button onClick={() => setShowQR(!showQR)} title="QR Code" className="text-xs bg-[#2e2e42] hover:bg-blue-600/30 hover:text-blue-300 text-gray-300 px-3 py-2 rounded-xl transition font-medium">QR</button>
          <button onClick={handleDelete} disabled={deleting} title="Delete" className="text-xs bg-[#2e2e42] hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-xl transition font-medium disabled:opacity-50">Delete</button>
        </div>
      </div>
      {showQR && (
        <div className="mt-4 pt-4 border-t border-[#2e2e42] flex justify-center animate-in">
          <div className="bg-white p-3 rounded-2xl shadow-lg">
            <QRCodeSVG value={url.shortUrl} size={140}/>
          </div>
        </div>
      )}
    </div>
  );
}