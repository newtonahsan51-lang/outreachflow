
import React, { useState } from 'react';
import { ShieldCheck, Activity, Loader2, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

const Deliverability = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [ipResults, setIpResults] = useState<any>(null);

  const handleIpCheck = async () => {
    setIsScanning(true);
    setIpResults(null);
    try {
      const res = await apiService.checkBlacklist();
      if (res && (res.results || res.ip)) {
        setIpResults(res);
      } else {
        alert("Server returned empty results. Please check back later.");
      }
    } catch (err: any) {
      alert("Scan failed: " + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <ShieldCheck className="text-blue-600" /> Deliverability Lab
          </h1>
          <p className="text-slate-500">Analyze your sender reputation and server status.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="text-2xl font-bold mb-4">ইনবক্স হেলথ স্কোর</h3>
             <p className="text-slate-500 leading-relaxed mb-6">আপনার ডোমেইন এবং আইপি বর্তমানে সুরক্ষিত আছে। আমরা রিয়েল-টাইমে গ্লোবাল ব্ল্যাকলিস্ট ডেটাবেস চেক করি।</p>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                  <CheckCircle2 size={16} /> <span className="text-xs font-bold uppercase">SPF Verified</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                  <CheckCircle2 size={16} /> <span className="text-xs font-bold uppercase">DKIM Signed</span>
                </div>
             </div>
           </div>
           <div className="absolute top-0 right-0 p-10 opacity-10">
              <Globe size={160} />
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white text-center shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                <Activity className="text-blue-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">গ্লোবাল আইপি চেক</h3>
              <p className="text-slate-400 text-xs mb-8">রিয়েল-টাইমে ১২০+ ব্ল্যাকলিস্ট চেক করুন।</p>
              <button 
                onClick={handleIpCheck}
                disabled={isScanning}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-500/20 disabled:opacity-50"
              >
                {isScanning ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
                {isScanning ? 'Scanning...' : 'Start Scan Now'}
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] group-hover:scale-150 transition-all duration-700"></div>
          </div>

          {ipResults && (
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-in zoom-in-95">
               <div className="flex items-center justify-between mb-6">
                 <h4 className="font-bold text-sm text-slate-900 dark:text-white">Scan Results</h4>
                 <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">IP: {ipResults.ip}</span>
               </div>
               <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {ipResults.results && Array.isArray(ipResults.results) ? ipResults.results.map((r: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                      <span className="text-[10px] font-bold text-slate-500 truncate max-w-[140px] uppercase tracking-tighter">{r.list}</span>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${r.status === 'Clean' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'}`}>
                        {r.status}
                      </span>
                    </div>
                  )) : (
                    <div className="p-4 text-center text-xs text-slate-400">Scan completed. No blacklists found.</div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deliverability;
