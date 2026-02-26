import { useState, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function useBitslave() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const authHeaders = (): Record<string, string> => {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/status`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to fetch status');
      return await res.json();
    } catch (err) {
      console.error(err);
      return { isDeployed: false, config: null };
    }
  }, []);

  const deployAgent = async (
    token: string, provider: string, apiKey: string,
    options?: { discordToken?: string; slackBotToken?: string; slackAppToken?: string; systemPrompt?: string }
  ) => {
    setIsDeploying(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          telegramToken: token,
          llmProvider: provider,
          llmApiKey: apiKey,
          ...options,
        }),
      });
      if (!res.ok) throw new Error('Failed to deploy agent');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsDeploying(false);
    }
  };

  const stopAgent = async () => {
    setIsDeploying(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/stop`, { 
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Failed to stop agent');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsDeploying(false);
    }
  };

  const fetchSetupStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/setup-status`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to fetch setup status');
      return await res.json();
    } catch (err) {
      console.error(err);
      return { status: 'unknown' };
    }
  }, []);

  const updateInstanceConfig = async (updates: Record<string, any>) => {
    try {
      const res = await fetch(`${API_BASE}/instance/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update config');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addChannel = async (channel: string, config: Record<string, any>) => {
    try {
      const res = await fetch(`${API_BASE}/instance/channels/${channel}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error(`Failed to add ${channel} channel`);
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeChannel = async (channel: string) => {
    try {
      const res = await fetch(`${API_BASE}/instance/channels/${channel}/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(`Failed to remove ${channel} channel`);
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateSkills = async (skills: Record<string, boolean>) => {
    try {
      const res = await fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ skills }),
      });
      if (!res.ok) throw new Error('Failed to update skills');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    fetchStatus,
    deployAgent,
    stopAgent,
    fetchSetupStatus,
    updateInstanceConfig,
    addChannel,
    removeChannel,
    updateSkills,
    isDeploying,
    error,
  };
}
