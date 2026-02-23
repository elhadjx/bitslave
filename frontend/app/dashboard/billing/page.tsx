import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/dashboard/glass-card";
import { CreditCard, Download } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="p-4 sm:p-8 space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Billing
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current plan */}
      <GlassCard className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">
              Current Plan
            </h2>
            <p className="text-3xl font-bold text-accent mt-2">Pro Plan</p>
            <p className="text-sm text-muted-foreground mt-2">
              $19/month • Billed monthly
            </p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            Change Plan
          </Button>
        </div>
      </GlassCard>

      {/* Billing history */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Billing History
        </h2>
        <div className="space-y-3">
          {[
            { date: "Feb 1, 2025", amount: "$19.00", status: "Paid" },
            { date: "Jan 1, 2025", amount: "$19.00", status: "Paid" },
            { date: "Dec 1, 2024", amount: "$19.00", status: "Paid" },
          ].map((invoice, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b last:border-0"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "var(--glass-bg)" }}
                >
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-foreground">
                  {invoice.amount}
                </span>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Payment method */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Payment Method
        </h2>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white font-bold text-sm">
                VISA
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Visa ending in 4242
                </p>
                <p className="text-sm text-muted-foreground">Expires 12/26</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="hover:bg-[oklch(0.15_0_0)]"
            style={{ borderColor: "var(--glass-border)" }}
          >
            Update
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
