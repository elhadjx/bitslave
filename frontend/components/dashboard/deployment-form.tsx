"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "./glass-card";
import { HelpCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface DeploymentFormProps {
  onDeploy?: (data: DeploymentData) => Promise<void>;
  onStop?: () => Promise<void>;
  isDeployed?: boolean;
  initialData?: DeploymentData | null;
}

export interface DeploymentData {
  token: string;
  provider: string;
  apiKey: string;
  discordToken?: string;
  slackBotToken?: string;
  slackAppToken?: string;
  systemPrompt?: string;
}

export function DeploymentForm({
  onDeploy,
  onStop,
  isDeployed = false,
  initialData,
}: DeploymentFormProps) {
  const [token, setToken] = useState("");
  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [discordToken, setDiscordToken] = useState("");
  const [slackBotToken, setSlackBotToken] = useState("");
  const [slackAppToken, setSlackAppToken] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (initialData) {
      setToken(initialData.token || "");
      setProvider(initialData.provider || "openai");
      setApiKey(initialData.apiKey || "");
      setDiscordToken(initialData.discordToken || "");
      setSlackBotToken(initialData.slackBotToken || "");
      setSlackAppToken(initialData.slackAppToken || "");
      setSystemPrompt(initialData.systemPrompt || "");
    }
  }, [initialData]);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !apiKey) return;

    setIsLoading(true);
    try {
      if (onDeploy)
        await onDeploy({
          token,
          provider,
          apiKey,
          discordToken: discordToken || undefined,
          slackBotToken: slackBotToken || undefined,
          slackAppToken: slackAppToken || undefined,
          systemPrompt: systemPrompt || undefined,
        });
      setToken("");
      setApiKey("");
      setDiscordToken("");
      setSlackBotToken("");
      setSlackAppToken("");
      setSystemPrompt("");
    } catch (error) {
      console.error("Deployment failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    setIsLoading(true);
    try {
      if (onStop) await onStop();
    } catch (error) {
      console.error("Stop failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Deployment Wizard</h2>
        <p className="text-muted-foreground text-sm">
          {isDeployed
            ? "Your agent is currently live. Update settings or stop the deployment."
            : "Configure and deploy your AI agent in seconds. No manual setup required."}
        </p>
      </div>

      <form onSubmit={handleDeploy} className="space-y-6">
        {/* Telegram Token */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="token" className="text-sm font-medium">
              Telegram Bot Token
            </Label>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              <div className="hidden group-hover:block absolute left-0 top-6 bg-popover text-popover-foreground text-xs p-2 rounded border border-border whitespace-nowrap z-10">
                Get this from @BotFather on Telegram
              </div>
            </div>
          </div>
          <Input
            id="token"
            type="password"
            placeholder="123456:ABCdefGHIjklmnoPQRstuvwxyz"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={isLoading}
            className="bg-input border-border"
          />
        </div>

        {/* Provider Select */}
        <div className="space-y-2">
          <Label htmlFor="provider" className="text-sm font-medium">
            LLM Provider
          </Label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="deepseek">DeepSeek</option>
            <option value="gemini">Google Gemini</option>
            <option value="openrouter">OpenRouter</option>
          </select>
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-sm font-medium">
            API Key
          </Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isLoading}
              className="bg-input border-border pr-10"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm disabled:opacity-50"
            >
              {showApiKey ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Advanced Section - Multi-channel & System Prompt */}
        <div
          className="border-t pt-4"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            Advanced Options (Discord, Slack, System Prompt)
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4">
              {/* Discord Token */}
              <div className="space-y-2">
                <Label htmlFor="discordToken" className="text-sm font-medium">
                  Discord Bot Token{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="discordToken"
                  type="password"
                  placeholder="Discord bot token"
                  value={discordToken}
                  onChange={(e) => setDiscordToken(e.target.value)}
                  disabled={isLoading}
                  className="bg-input border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Enable <strong>MESSAGE CONTENT INTENT</strong> in Bot →
                  Privileged Gateway Intents
                </p>
              </div>

              {/* Slack Tokens */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="slackBotToken"
                    className="text-sm font-medium"
                  >
                    Slack Bot Token{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="slackBotToken"
                    type="password"
                    placeholder="xoxb-..."
                    value={slackBotToken}
                    onChange={(e) => setSlackBotToken(e.target.value)}
                    disabled={isLoading}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="slackAppToken"
                    className="text-sm font-medium"
                  >
                    Slack App Token{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="slackAppToken"
                    type="password"
                    placeholder="xapp-..."
                    value={slackAppToken}
                    onChange={(e) => setSlackAppToken(e.target.value)}
                    disabled={isLoading}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <Label htmlFor="systemPrompt" className="text-sm font-medium">
                  System Prompt{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <textarea
                  id="systemPrompt"
                  placeholder="Customize your bot's personality and behavior..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  disabled={isLoading}
                  rows={3}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 resize-y"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading || !token || !apiKey}
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deploying...
              </>
            ) : (
              "Deploy Agent"
            )}
          </Button>

          {isDeployed && (
            <Button
              type="button"
              onClick={handleStop}
              disabled={isLoading}
              variant="destructive"
              className="px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Stopping...
                </>
              ) : (
                "Stop Agent"
              )}
            </Button>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
