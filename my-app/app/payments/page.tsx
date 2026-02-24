"use client";

import { useState } from "react";
import Script from "next/script";
import Image from "next/image";
import { ModalPricing, Plan } from "@/components/ui/modal-pricing";
import { Code, ShieldCheck, Zap } from "lucide-react";

// Predefined available plans
const PLANS: Plan[] = [
    { id: "plan_basic", name: "Basic", price: 999, features: ["Up to 5 Projects", "Community Support", "10GB Storage"] },
    { id: "plan_pro", name: "Pro", price: 2499, features: ["Unlimited Projects", "Premium Support", "100GB Storage", "Custom Domains"] },
];

export default function PaymentsPage() {
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
        <div className="min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white pb-24 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />

            {/* Hero Section */}
            <div className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden border-b border-white/5 py-24">
                <Image
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Premium workspace background"
                    fill
                    className="object-cover opacity-40 grayscale-[0.2]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />

                <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <Zap className="h-3 w-3 fill-current" />
                        Next-Gen Checkout Flow
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-center mb-6 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Elevate Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Workflow</span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 text-center max-w-2xl font-medium mb-12 leading-relaxed animate-in fade-in duration-1000 delay-200">
                        The gold standard for modern developers. Deploy secure, scalable payment integrations in minutes with our Razorpay-backed architecture.
                    </p>

                    <div className="animate-in fade-in zoom-in duration-700 delay-500">
                        <ModalPricing plans={PLANS} onConfirm={handleUpgrade} isLoading={isLoading} />
                    </div>
                </div>
            </div>

            {/* Value Proposition Section */}
            <div className="max-w-6xl mx-auto px-6 py-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group flex flex-col items-start text-left space-y-4 p-8 bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:translate-y-[-4px]">
                        <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                            <p className="text-zinc-500 leading-relaxed font-medium">Built on Next.js 14 for sub-second rendering and instant interaction metrics.</p>
                        </div>
                    </div>

                    <div className="group flex flex-col items-start text-left space-y-4 p-8 bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:translate-y-[-4px]">
                        <div className="h-12 w-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-500">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Secure by Design</h3>
                            <p className="text-zinc-500 leading-relaxed font-medium">Server-side HMAC-256 order signatures ensure zero client-side vulnerability.</p>
                        </div>
                    </div>

                    <div className="group flex flex-col items-start text-left space-y-4 p-8 bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] border border-white/5 hover:border-zinc-500/30 transition-all duration-500 hover:translate-y-[-4px]">
                        <div className="h-12 w-12 bg-zinc-500/10 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:scale-110 group-hover:bg-zinc-500/20 transition-all duration-500">
                            <Code className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Developer Experience</h3>
                            <p className="text-zinc-500 leading-relaxed font-medium">Clean TypeScript architecture with reusable primitives using shadcn/ui.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
