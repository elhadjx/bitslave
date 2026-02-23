import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Acceptable Use Policy",
  description: "Acceptable Use Policy for Bitslave",
};

export default function AcceptableUsePolicy() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-8 -ml-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-4">Acceptable Use Policy</h1>
          <p className="text-muted-foreground">
            Last updated: February 24, 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Welcome to Bitslave. To ensure a safe, reliable, and compliant
            platform for deploying and managing autonomous AI assistants, all
            users must adhere to this Acceptable Use Policy (AUP). By using our
            services, you agree to comply with the terms outlined below.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            1. No Spam or Unsolicited Messaging
          </h2>
          <p>
            You may not use Bitslave to send, distribute, or automate the
            delivery of spam or unsolicited messages. This includes, but is not
            limited to, unwanted promotional content, phishing attempts, or mass
            messaging to users who have not explicitly opted in.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            2. No Bulk Marketing Automation
          </h2>
          <p>
            Our platform is designed for hosting personalized, intelligent
            autonomous AI assistants. Using Bitslave for bulk marketing
            campaigns, mass outreach automation, or high-volume unsolicited
            sales tactics is strictly prohibited.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            3. No Illegal Activities
          </h2>
          <p>
            You may not use Bitslave for any illegal, fraudulent, or malicious
            activities. Agents hosted on our platform cannot be used to
            coordinate, promote, or execute activities that violate local,
            national, or international laws.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            4. Compliance with Telegram Terms of Service
          </h2>
          <p>
            If your AI assistant operates on Telegram, you must fully comply
            with Telegram's Terms of Service and API Guidelines. Any bot that
            violates Telegram's platform rules may be suspended or removed from
            Bitslave without notice.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            5. Customer Responsibility for API Usage
          </h2>
          <p>
            You are entirely responsible for the actions of your autonomous AI
            assistants and any associated API usage. Bitslave acts as an
            orchestration and hosting layer; therefore, you are responsible for
            providing your own API keys (e.g., OpenAI, Anthropic). You are
            accountable for ensuring that your AI provider's usage policies are
            respected and for covering any costs incurred through your API
            usage.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            6. Enforcement
          </h2>
          <p>
            We reserve the right to monitor compliance with this policy.
            Violations of this Acceptable Use Policy may result in the immediate
            suspension or termination of your account, at our sole discretion,
            without warning or refund.
          </p>
        </div>
      </div>
    </div>
  );
}
