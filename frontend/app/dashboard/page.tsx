"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/dashboard/glass-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  DeploymentForm,
  DeploymentData,
} from "@/components/dashboard/deployment-form";
import {
  Clock,
  Container,
  Activity,
  Wifi,
  WifiOff,
  ExternalLink,
} from "lucide-react";
import { useBitslave } from "@/hooks/useBitslave";

function formatUptime(ms: number): string {
  if (!ms) return "—";
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatTimeAgo(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DashboardPage() {
  const [isDeployed, setIsDeployed] = useState(false);
  const [deployedData, setDeployedData] = useState<DeploymentData | null>(null);
  const [setupStatus, setSetupStatus] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const { fetchStatus, deployAgent, stopAgent, fetchSetupStatus, isDeploying } =
    useBitslave();

  // Fetch initial status
  useEffect(() => {
    fetchStatus().then((data: any) => {
      setIsDeployed(data.isDeployed);
      if (data.config) {
        setDeployedData({
          token: data.config.telegramToken,
          provider: data.config.llmProvider,
          apiKey: data.config.llmApiKey,
          discordToken: data.config.discordToken,
          slackBotToken: data.config.slackBotToken,
          slackAppToken: data.config.slackAppToken,
          systemPrompt: data.config.systemPrompt,
        });
        // Fetch setup status if deployed
        if (data.isDeployed) {
          fetchSetupStatus().then(setSetupStatus);
        }
      }
    });
  }, [fetchStatus, fetchSetupStatus]);

  // Poll setup status while deploying
  useEffect(() => {
    if (!isDeployed) return;
    const interval = setInterval(async () => {
      const status = await fetchSetupStatus();
      setSetupStatus(status);
    }, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, [isDeployed, fetchSetupStatus]);

  // Fetch logs
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/logs`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((r) => r.json())
      .then((data) => setLogs(data.logs || []))
      .catch(() => {});
  }, [isDeployed]);

  const handleDeploy = async (data: DeploymentData) => {
    try {
      await deployAgent(data.token, data.provider, data.apiKey, {
        discordToken: data.discordToken,
        slackBotToken: data.slackBotToken,
        slackAppToken: data.slackAppToken,
        systemPrompt: data.systemPrompt,
      });
      setIsDeployed(true);
      setDeployedData(data);
      setSetupStatus({ status: "provisioning" });
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  const handleStop = async () => {
    try {
      await stopAgent();
      setIsDeployed(false);
      setDeployedData(null);
      setSetupStatus(null);
    } catch (err) {
      console.error("Stop failed", err);
    }
  };

  const getDeploymentStep = () => {
    if (!isDeployed) return null;
    if (!setupStatus)
      return {
        step: 1,
        label: "Deploying...",
        sublabel: "Creating Railway service",
      };
    if (setupStatus.status === "provisioning")
      return {
        step: 2,
        label: "Provisioning...",
        sublabel: "Auto-configuring OpenClaw",
      };
    if (setupStatus.status === "configured")
      return { step: 3, label: "Live", sublabel: "Agent is running" };
    return { step: 1, label: "Starting...", sublabel: "" };
  };

  const deployStep = getDeploymentStep();
  const health = setupStatus?.instanceHealth;

  return (
    <div className="p-4 sm:p-8 space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          My Agent
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage and monitor your autonomous AI agent
        </p>
      </div>

      {/* Agent Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    Agent Status
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Current deployment state
                  </p>
                </div>
                <StatusBadge
                  status={
                    isDeployed
                      ? setupStatus?.status === "configured"
                        ? "live"
                        : "deploying"
                      : "offline"
                  }
                />
              </div>

              {/* Deployment Progress Bar */}
              {isDeployed && deployStep && deployStep.step < 3 && (
                <div
                  className="pt-3 border-t"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((s) => (
                        <div
                          key={s}
                          className="h-1.5 w-8 rounded-full transition-colors"
                          style={{
                            backgroundColor:
                              s <= deployStep.step
                                ? "oklch(0.75 0.22 252)"
                                : "var(--glass-border)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {deployStep.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {deployStep.sublabel}
                  </p>
                </div>
              )}

              {isDeployed && (
                <div
                  className="pt-4 border-t space-y-3"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      {health?.gatewayReachable ? (
                        <Wifi className="w-5 h-5 text-[oklch(0.70_0.25_142.5)]" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Gateway</p>
                        <p className="text-sm font-medium text-foreground">
                          {health?.gatewayReachable
                            ? "Connected"
                            : health
                              ? "Offline"
                              : "Starting..."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                        <p className="text-sm font-medium text-foreground">
                          {health ? formatUptime(health.uptimeMs) : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="pt-2 border-t"
                    style={{ borderColor: "var(--glass-border)" }}
                  >
                    <p className="text-xs text-muted-foreground mb-2">
                      Configuration
                    </p>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-foreground">
                        Provider:{" "}
                        <span className="text-[oklch(0.75_0.22_252)]">
                          {deployedData?.provider}
                        </span>
                      </p>
                      <p className="text-foreground">
                        Token:{" "}
                        <span className="text-[oklch(0.75_0.22_252)]">
                          {deployedData?.token?.slice(0, 10)}...
                        </span>
                      </p>
                      {setupStatus?.domain && (
                        <p className="text-foreground">
                          Domain:{" "}
                          <a
                            href={`https://${setupStatus.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[oklch(0.75_0.22_252)] hover:underline inline-flex items-center gap-1"
                          >
                            {setupStatus.domain}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Quick stats — real data from health reports */}
        <div className="space-y-4">
          <GlassCard className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Gateway Status
                </p>
                <p
                  className={`text-3xl font-bold ${health?.gatewayRunning ? "text-[oklch(0.70_0.25_142.5)]" : "text-muted-foreground"}`}
                >
                  {health?.gatewayRunning
                    ? "Running"
                    : isDeployed
                      ? "Starting"
                      : "Offline"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {health?.timestamp
                  ? `Last report: ${formatTimeAgo(health.timestamp)}`
                  : "No health data yet"}
              </p>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Configured</p>
                <p
                  className={`text-3xl font-bold ${setupStatus?.configuredAt ? "text-[oklch(0.70_0.25_142.5)]" : "text-muted-foreground"}`}
                >
                  {setupStatus?.configuredAt
                    ? "✓ Yes"
                    : isDeployed
                      ? "Pending"
                      : "—"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {setupStatus?.configuredAt
                  ? `Since ${formatTimeAgo(setupStatus.configuredAt)}`
                  : "Auto-configures on first boot"}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Deployment Form */}
      <DeploymentForm
        onDeploy={handleDeploy}
        onStop={handleStop}
        isDeployed={isDeployed}
        initialData={deployedData}
      />

      {/* Recent Activity — real logs */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {logs.length > 0 ? (
            logs
              .slice(-10)
              .reverse()
              .map((log: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <div className="flex items-center gap-2">
                    <Activity
                      className={`w-3.5 h-3.5 ${log.level === "error" ? "text-red-400" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-sm ${log.level === "error" ? "text-red-400" : "text-foreground"}`}
                    >
                      {log.message}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {log.createdAt ? formatTimeAgo(log.createdAt) : ""}
                  </span>
                </div>
              ))
          ) : (
            <p className="text-sm text-muted-foreground">
              {isDeployed
                ? "Waiting for activity..."
                : "No activity yet. Deploy your agent to get started."}
            </p>
          )}
        </div>
      </GlassCard>

      {/* Setup fallback link */}
      {isDeployed && setupStatus?.domain && (
        <p className="text-center text-xs text-muted-foreground">
          Having issues?{" "}
          <a
            href={`https://${setupStatus.domain}/setup`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[oklch(0.75_0.22_252)] hover:underline"
          >
            Open manual setup panel →
          </a>
        </p>
      )}
    </div>
  );
}
