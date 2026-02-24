"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";
import { Button } from "./button";

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface ModalPricingProps {
  plans: Plan[];
  onConfirm: (planId: string) => void;
  isLoading: boolean;
}

/**
 * ModalPricing Component
 * Renders a Dialog containing a radio group of pricing plans.
 * 
 * Props expected:
 * - plans: Array of available pricing tiers.
 * - onConfirm: Callback executed when the user confirms their selection.
 * - isLoading: Boolean state to disable inputs while Razorpay order is generating.
 */
export function ModalPricing({ plans, onConfirm, isLoading }: ModalPricingProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0]?.id || "");
  const [isOpen, setIsOpen] = useState(false);

  // Handle the confirmation process locally before handing off to parent
  const handleCheckout = () => {
    if (selectedPlan) {
      onConfirm(selectedPlan);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* The button that opens the modal */}
        <Button size="lg" className="px-8 py-6 text-lg rounded-full font-semibold shadow-xl transition-transform hover:scale-105">
          Upgrade Plan
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white/60 backdrop-blur-xl border-zinc-200">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-bold text-center">Select your plan</DialogTitle>
            <DialogDescription className="text-center text-zinc-500 mt-2">
              Choose the package that best fits your needs. You can always upgrade later.
            </DialogDescription>
          </DialogHeader>

          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="gap-4">
            {plans.map((plan) => (
              <Label
                key={plan.id}
                htmlFor={plan.id}
                className={`
                  relative flex cursor-pointer flex-col rounded-2xl border-2 p-6 transition-all text-zinc-900 duration-200
                  ${selectedPlan === plan.id ? "border-blue-600 bg-blue-50/50 scale-[1.02] shadow-md z-10" : "border-zinc-200 bg-white/80 hover:border-zinc-300 hover:bg-zinc-50"}
                  ${isLoading ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                <div className="flex w-full items-center justify-between">
                  {/* Radio Button hidden visually but handles accessibility */}
                  <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />

                  <div className="flex flex-col">
                    <span className="text-xl font-bold">{plan.name}</span>
                    <span className="text-sm font-medium text-zinc-500 mt-1">Billed once</span>
                  </div>

                  <span className="text-3xl font-bold tracking-tight">
                    ₹{plan.price}
                  </span>
                </div>

                {/* Visual feedback for selection */}
                {selectedPlan === plan.id && (
                  <div className="absolute top-6 right-6 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm animate-in zoom-in duration-200">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                )}

                <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 bg-zinc-50 p-6 border-t border-zinc-100">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="rounded-xl w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isLoading || !selectedPlan}
            className="rounded-xl w-full sm:w-auto min-w-[140px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : "Confirm Selection"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
