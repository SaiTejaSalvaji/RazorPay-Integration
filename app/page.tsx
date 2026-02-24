import Link from "next/link";
import { Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full bg-zinc-950/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 p-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        <div className="h-20 w-20 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse border border-blue-500/20">
          <Zap className="h-10 w-10 fill-current" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
          Razorpay Integration <br />is Now Live
        </h1>

        <p className="text-zinc-400 text-lg mb-12 font-medium leading-relaxed">
          The application core has been successfully deployed. Your secure payment portal is ready for interaction.
        </p>

        <Link
          href="/payments"
          className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-2xl font-bold text-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5 w-full"
        >
          Launch Payments Portal
          <div className="absolute inset-0 rounded-2xl ring-4 ring-white/10 group-hover:ring-white/20 transition-all duration-300" />
        </Link>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-sm text-zinc-600 font-mono tracking-widest uppercase">
            Status: Production Ready
          </p>
        </div>
      </div>
    </div>
  );
}
