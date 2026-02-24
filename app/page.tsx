"use client";

import { useState } from "react";
import Script from "next/script";
import Image from "next/image";
import { ModalPricing, Plan } from "@/components/ui/modal-pricing";
import { Code, ShieldCheck, Zap, Github, Terminal } from "lucide-react";

// Predefined available plans
const PLANS: Plan[] = [
  { id: "plan_basic", name: "Basic", price: 999, features: ["Up to 5 Projects", "Community Support", "10GB Storage"] },
  { id: "plan_pro", name: "Pro", price: 2499, features: ["Unlimited Projects", "Premium Support", "100GB Storage", "Custom Domains"] },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string } | null>(null);

  /**
   * Initializes the Razorpay flow:
   * 1. Calls our secure backend to create an Order.
   * 2. Extracts the `order_id`.
   * 3. Configures and opens the Razorpay popup.
   */
  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);

    try {
      // Find the price to send for validation (ensure server also validates)
      const selectedPlan = PLANS.find(p => p.id === planId);
      if (!selectedPlan) throw new Error("Invalid plan selected");

      // 1. Call backend to create Razorpay Order securely
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedPlan.price }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // 2. Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Safe to expose public key
        amount: data.amount,                          // Native subunit amount (paise)
        currency: "INR",
        name: "My App Inc.",
        description: `Upgrade to ${selectedPlan.name} Plan`,
        order_id: data.orderId,                       // Received from our backend
        handler: function (response: any) {
          // This callback executes when payment is successful
          // We receive payment_id, order_id, and signature here.
          setSuccessData({ id: response.razorpay_payment_id });
          console.log("Full Response:", response);
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#09090b", // Customizing the checkout window to match our dark zinc theme
        },
      };

      // 3. Open Razorpay Checkout modal
      // @ts-ignore - Razorpay is loaded dynamically via Next/Script
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        // Handle failure callback
        console.error("Payment failed", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong during checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-blue-600 selection:text-white relative overflow-hidden">
        {/* Abstract Premium Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 -right-20 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full bg-zinc-950/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
          <div className="h-24 w-24 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
            <ShieldCheck className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 text-white tracking-tight">Payment Verified</h2>
          <p className="text-zinc-400 mb-10 font-medium leading-relaxed">
            Your transaction has been securely processed. You are now rocking the upgraded tier.
          </p>

          <div className="bg-white/5 rounded-2xl p-5 mb-8 border border-white/10 text-left flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-zinc-500 uppercase text-xs font-bold tracking-widest relative z-10">Transaction ID</span>
            <div className="flex items-center gap-3 relative z-10">
              <span className="font-mono text-zinc-200 text-lg tracking-wider break-all">{successData.id}</span>
            </div>
          </div>

          <button
            onClick={() => setSuccessData(null)}
            className="w-full py-4 px-6 bg-white text-black rounded-2xl font-bold text-lg hover:bg-zinc-200 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-white/5"
          >
            Return to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white pb-24 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* Hero Section */}
      <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5 py-24">
        <Image
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Source code background"
          fill
          className="object-cover opacity-20 grayscale pointer-events-none"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black pointer-events-none" />

        <div className="relative z-20 flex flex-col items-center justify-center px-4 max-w-5xl pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Terminal className="h-3 w-3" />
            Production Reference Template
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-center mb-8 leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
            Master <span className="text-blue-500 font-mono">Razorpay</span> <br />Integrations
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 text-center max-w-3xl font-medium mb-12 leading-relaxed">
            A definitive, open-source reference for building secure payment flows with Next.js 14.
            Includes server-side order generation, verified security patterns, and premium Tailwind UI.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-30">
            <ModalPricing plans={PLANS} onConfirm={handleUpgrade} isLoading={isLoading} />

            <a
              href="https://github.com/SaiTejaSalvaji/RazorPay-Integration"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold text-lg"
            >
              <Github className="h-5 w-5" />
              Reference Code
            </a>
          </div>
        </div>
      </div>

      {/* Reference Detail Section */}
      <div className="max-w-6xl mx-auto px-6 py-24 relative z-20">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Code Overview</h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium">
            Standardized boilerplate for modern full-stack payment processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="group p-8 bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
            <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Security First</h3>
            <p className="text-zinc-500 leading-relaxed font-medium mb-6">
              Protects your <code className="text-blue-400 font-mono text-sm px-1 bg-blue-400/10 rounded">RAZORPAY_SECRET</code> by isolating logic in isolated Node.js server runtimes.
            </p>
            <div className="text-[11px] font-mono text-zinc-600 bg-black/50 p-4 rounded-xl border border-white/5">
              app/api/create-order/route.ts
            </div>
          </div>

          <div className="group p-8 bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500">
            <div className="h-14 w-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8">
              <Zap className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">App Router</h3>
            <p className="text-zinc-500 leading-relaxed font-medium mb-6">
              Utilizes Next.js 14 features like <code className="text-purple-400 font-mono text-sm px-1 bg-purple-400/10 rounded">next/script</code> and Server Components for optimal perf.
            </p>
            <div className="text-[11px] font-mono text-zinc-600 bg-black/50 p-4 rounded-xl border border-white/5">
              app/page.tsx (use client)
            </div>
          </div>

          <div className="group p-8 bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 hover:border-zinc-500/30 transition-all duration-500">
            <div className="h-14 w-14 bg-zinc-500/10 rounded-2xl flex items-center justify-center text-zinc-400 mb-8">
              <Code className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Shadcn Primitives</h3>
            <p className="text-zinc-500 leading-relaxed font-medium mb-6">
              Composable UI components built on Radix UI for maximum accessibility and developer flexibility.
            </p>
            <div className="text-[11px] font-mono text-zinc-600 bg-black/50 p-4 rounded-xl border border-white/5">
              components/ui/modal-pricing.tsx
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
