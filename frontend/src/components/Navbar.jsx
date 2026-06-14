import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="glass px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-teal-500 flex items-center justify-center text-xl glow-btn">
          ⚡
        </div>
        <span className="text-xl font-extrabold gradient-text">LinkSnap</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-300 text-sm hidden sm:flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </span>
          {user?.name}
        </span>
        <button onClick={handleLogout}
          className="bg-[#2e2e42] hover:bg-red-500/20 hover:text-red-400 text-gray-300 text-sm px-4 py-2 rounded-xl transition border border-[#3e3e52]">
          Logout
        </button>
      </div>
    </nav>
  );
}