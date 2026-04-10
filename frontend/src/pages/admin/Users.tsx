import { useState, useEffect } from 'react';
import { 
  Search, UserPlus, Trash2, Filter, 
  Mail, School, Shield, User as UserIcon, X
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    schoolName: '',
    adminPin: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/add-user', formData);
      toast.success(`User ${formData.name} added successfully`);
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'Student', schoolName: '' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/admin/delete-user/${id}`);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.schoolName && user.schoolName.toLowerCase().includes(search.toLowerCase()));
    
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-glow tracking-tighter">Identity Management</h1>
          <p className="text-slate-400">Manage students, teachers, and system administrators</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          <UserPlus size={18} /> Add New User
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
          />
        </div>
        <div className="flex bg-slate-900/40 border border-slate-800 rounded-xl p-1 items-center">
           {['All', 'Student', 'Teacher', 'Admin'].map(role => (
             <button
               key={role}
               onClick={() => setFilterRole(role)}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                 filterRole === role ? 'bg-indigo-500 text-slate-900' : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               {role}
             </button>
           ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800/50">
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">User Details</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Educational Hub</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Registration</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex justify-center"><div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" /></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-500 italic">No users found matching your criteria.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-800/10 transition-all group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-indigo-400">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200 group-hover:text-glow transition-all">{user.name}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1"><Mail size={10} /> {user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black tracking-tighter uppercase border ${
                        user.role === 'Admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        user.role === 'Teacher' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-400 flex items-center gap-1.5">
                        <School size={12} className="text-slate-600" /> {user.schoolName || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-md p-8 border-slate-700 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black text-slate-100 mb-6">Create New Identity</h2>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Email Address</label>
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Initial Password</label>
                <input 
                  type="password" required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Account Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-all text-sm appearance-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">School/Hub</label>
                  <input 
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              {formData.role === 'Admin' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Admin Security PIN (6 Digits)</label>
                  <input 
                    type="password"
                    maxLength={6}
                    required
                    value={formData.adminPin}
                    onChange={(e) => setFormData({...formData, adminPin: e.target.value.replace(/\D/g, '')})}
                    className="w-full bg-slate-900/50 border border-amber-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all text-sm"
                    placeholder="Enter 6-digit PIN"
                  />
                </div>
              )}

              <button 
                type="submit"
                className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 text-slate-900 py-3 rounded-xl font-bold transition-all"
              >
                Provision Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
