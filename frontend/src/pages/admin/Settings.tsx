import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Settings as SettingsIcon, 
  Bell, 
  Monitor, 
  Info,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPin, setShowPin] = useState(false);
    
    const [settings, setSettings] = useState({
        newPassword: '',
        confirmPassword: '',
        adminPin: '',
    });

    const [platformSettings, setPlatformSettings] = useState({
        darkMode: true,
        maintenanceMode: false,
        emailNotifications: true,
        autoApproveMissions: false
    });

    const handleUpdateSecurity = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (settings.adminPin && (settings.adminPin.length !== 6 || isNaN(Number(settings.adminPin)))) {
            return toast.error("Security PIN must be 6 digits");
        }

        try {
            setLoading(true);
            const res = await axios.put('/admin/settings', {
                password: settings.newPassword || undefined,
                adminPin: settings.adminPin || undefined
            });
            toast.success(res.data.message || 'Security settings updated');
            setSettings({ newPassword: '', confirmPassword: '', adminPin: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const togglePlatformSetting = (key: keyof typeof platformSettings) => {
        setPlatformSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        toast.success(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated`);
    };

    return (
        <div className="space-y-8 p-6 md:p-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <SettingsIcon className="text-emerald-500" size={32} />
                        Admin Settings
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage security preferences and platform configurations</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-black uppercase tracking-widest">
                        System Online
                    </span>
                    <span className="text-slate-600 text-xs font-bold mr-2">v1.2.4-stable</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Security Section */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 border-slate-800/50"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <Shield className="text-emerald-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">Security & Access</h2>
                                <p className="text-slate-500 text-sm">Update your administrative credentials and PIN</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateSecurity} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            value={settings.newPassword}
                                            onChange={(e) => setSettings({...settings, newPassword: e.target.value})}
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                                            placeholder="Enter new password"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            value={settings.confirmPassword}
                                            onChange={(e) => setSettings({...settings, confirmPassword: e.target.value})}
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                                            placeholder="Confirm password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Security PIN (6-Digits)</label>
                                <div className="relative group max-w-sm">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                    <input 
                                        type={showPin ? "text" : "password"}
                                        maxLength={6}
                                        value={settings.adminPin}
                                        onChange={(e) => setSettings({...settings, adminPin: e.target.value.replace(/\D/g, '')})}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all tracking-[0.5em] font-mono"
                                        placeholder="000000"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPin(!showPin)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                                    >
                                        {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-2 ml-1">
                                    This PIN is required for every admin login session.
                                </p>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-black rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] flex items-center gap-3 group"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                {loading ? 'UPDATING...' : 'SAVE SECURITY SETTINGS'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Preferences */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-8 border-slate-800/50"
                    >
                         <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-500/10 rounded-2xl">
                                <Monitor className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">Platform Preferences</h2>
                                <p className="text-slate-500 text-sm">Customize how the platform behaves</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'darkMode', label: 'Fixed Dark Theme', desc: 'Maintain the high-contrast dark aesthetic', icon: Monitor, color: 'emerald' },
                                { id: 'emailNotifications', label: 'Email Alerts', desc: 'Get notified for new teacher registrations', icon: Bell, color: 'blue' },
                                { id: 'autoApproveMissions', label: 'Auto-Approve Quizzes', desc: 'Trust verified teachers automatically', icon: CheckCircle, color: 'teal' },
                                { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Suspend platform access for students', icon: AlertCircle, color: 'rose' },
                            ].map((item) => (
                                <button 
                                    key={item.id}
                                    onClick={() => togglePlatformSetting(item.id as any)}
                                    className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${
                                        platformSettings[item.id as keyof typeof platformSettings] 
                                        ? 'bg-emerald-500/5 border-emerald-500/30' 
                                        : 'bg-slate-900/30 border-slate-800/50 hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <div className={`p-2 rounded-xl bg-slate-950/50 ${
                                            platformSettings[item.id as keyof typeof platformSettings] ? 'text-emerald-400' : 'text-slate-600'
                                        }`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-200">{item.label}</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition-all ${
                                        platformSettings[item.id as keyof typeof platformSettings] ? 'bg-emerald-500' : 'bg-slate-800'
                                    }`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                            platformSettings[item.id as keyof typeof platformSettings] ? 'left-7' : 'left-1'
                                        }`} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                     <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 border-slate-800/50 bg-emerald-500/5"
                    >
                         <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                            <Info className="text-emerald-500" size={20} />
                            Platform Health
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-xs font-bold text-slate-400">Database Status</span>
                                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Optimized</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-xs font-bold text-slate-400">API Latency</span>
                                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">24ms</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-xs font-bold text-slate-400">Storage Usage</span>
                                <span className="text-slate-300 text-xs font-black uppercase tracking-widest">12%</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-xs font-bold text-slate-400">Last Backup</span>
                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Today, 04:00 AM</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 border-slate-800/50"
                    >
                         <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                            <RefreshCw className="text-blue-500" size={20} />
                            Recent Logs
                        </h3>
                        <div className="space-y-4">
                            {[
                                { event: 'PIN Changed', time: '2 days ago', icon: Shield },
                                { event: 'System Backup', time: '14h ago', icon: Info },
                                { event: 'Cache Purged', time: '2h ago', icon: RefreshCw },
                            ].map((log, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-900 rounded-lg text-slate-600">
                                        <log.icon size={12} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase leading-none">{log.event}</p>
                                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
