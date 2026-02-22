import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:3001/api';

export function useBitslave() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchStatus = useCallback(async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/status`, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      if (!res.ok) throw new Error('Failed to fetch status');
      return await res.json();
    } catch (err) {
      console.error(err);
      return { isDeployed: false, config: null };
    }
  }, []);

  const deployAgent = async (token: string, provider: string, apiKey: string) => {
    setIsDeploying(true);
    setError(null);
    try {
      const tokenHeader = getToken();
      const res = await fetch(`${API_BASE}/deploy`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(tokenHeader ? { 'Authorization': `Bearer ${tokenHeader}` } : {})
        },
        body: JSON.stringify({ telegramToken: token, llmProvider: provider, llmApiKey: apiKey }),
      });
      if (!res.ok) throw new Error('Failed to deploy agent');
      const data = await res.json();
      return data;
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
      const tokenHeader = getToken();
      const res = await fetch(`${API_BASE}/stop`, { 
        method: 'POST',
        headers: { ...(tokenHeader ? { 'Authorization': `Bearer ${tokenHeader}` } : {}) }
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

  return { fetchStatus, deployAgent, stopAgent, isDeploying, error };
}
