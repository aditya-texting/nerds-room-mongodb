import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500 mb-8 font-medium">
          You don't have permission to access the dashboard. This area is restricted to Administrators and VCOs.
        </p>
        <Link 
          href="/" 
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00308F] px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#002266] shadow-md hover:shadow-lg"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
