import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Widget from './components/Widget';
import Settings from './components/Settings';
import { initialConfig, type WidgetConfig } from './config';
import { isCloudSyncConfigured, loadCloudConfig, saveCloudConfig } from './cloudSync';

const STORAGE_KEY = 'widgetConfig';
const LEGACY_STORAGE_KEY = 'twitch-social-widget-config-v1';
const PROFILE_ID = new URLSearchParams(window.location.search).get('profile') === 'domentos' ? 'domentos' : 'default';
const PROFILE_NAME = PROFILE_ID === 'domentos' ? 'Domentos' : 'vanesso4ka_tools';

function createProfileConfig(): WidgetConfig {
  return {
    ...initialConfig,
    title: 'Domentos',
    instagram: { ...initialConfig.instagram, username: '', link: '', isEnabled: false },
    telegram: { ...initialConfig.telegram, username: '', link: '', isEnabled: false },
    website: { ...initialConfig.website, username: '', link: '', isEnabled: false },
  };
}

function deepMerge<T>(base: T, override: Partial<T> | null | undefined): T {
  if (!override || typeof override !== 'object') return base;
  const result: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const key of Object.keys(override as any)) {
    const oVal = (override as any)[key];
    const bVal = (base as any)[key];
    if (oVal && typeof oVal === 'object' && !Array.isArray(oVal) && bVal && typeof bVal === 'object' && !Array.isArray(bVal)) {
      result[key] = deepMerge(bVal, oVal);
    } else if (oVal !== undefined) {
      result[key] = oVal;
    }
  }
  return result as T;
}

function loadLocalConfig(): WidgetConfig {
  const fallback = PROFILE_ID === 'domentos' ? createProfileConfig() : initialConfig;
  try {
    const storageKey = PROFILE_ID === 'default' ? STORAGE_KEY : `${STORAGE_KEY}:${PROFILE_ID}`;
    const raw = localStorage.getItem(storageKey) ?? (PROFILE_ID === 'default' ? localStorage.getItem(LEGACY_STORAGE_KEY) : null);
    if (!raw) return fallback;
    return deepMerge(fallback, JSON.parse(raw));
  } catch {
    return fallback;
  }
}

type SyncStatus = 'connecting' | 'connected' | 'saving' | 'error' | 'not-configured';

const App: React.FC = () => {
  const [config, setConfig] = useState<WidgetConfig>(() => loadLocalConfig());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(isCloudSyncConfigured() ? 'connecting' : 'not-configured');
  const [cloudReady, setCloudReady] = useState(false);
  const isWidgetPage = window.location.pathname.startsWith('/widget');

  useEffect(() => {
    let active = true;
    loadCloudConfig(PROFILE_ID)
      .then((remote) => {
        if (!active) return;
        if (remote) setConfig((current) => deepMerge(current, remote));
        setSyncStatus(isCloudSyncConfigured() ? 'connected' : 'not-configured');
      })
      .catch(() => active && setSyncStatus('error'))
      .finally(() => active && setCloudReady(true));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_ID === 'default' ? STORAGE_KEY : `${STORAGE_KEY}:${PROFILE_ID}`, JSON.stringify(config));
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }, [config]);

  // The settings page is the only writer. Debouncing avoids a request for every keystroke.
  useEffect(() => {
    if (!cloudReady || isWidgetPage || !isCloudSyncConfigured()) return;
    setSyncStatus('saving');
    const timer = window.setTimeout(() => {
      saveCloudConfig(config, PROFILE_ID)
        .then(() => setSyncStatus('connected'))
        .catch(() => setSyncStatus('error'));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [config, cloudReady, isWidgetPage]);

  // OBS reads the shared config continuously; changes appear without reloading Browser Source.
  useEffect(() => {
    if (!isWidgetPage || !cloudReady || !isCloudSyncConfigured()) return;
    let active = true;
    let inFlight = false;
    const sync = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const remote = await loadCloudConfig(PROFILE_ID);
        if (active && remote) {
          setConfig((current) => JSON.stringify(current) === JSON.stringify(remote) ? current : deepMerge(current, remote));
        }
      } catch {
        if (active) setSyncStatus('error');
      } finally {
        inFlight = false;
      }
    };
    const timer = window.setInterval(sync, 1200);
    return () => { active = false; window.clearInterval(timer); };
  }, [cloudReady, isWidgetPage]);

  const widgetElement = useMemo(() => <Widget config={config} />, [config]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/widget" element={widgetElement} />
        <Route path="/settings" element={<Settings config={config} setConfig={setConfig} syncStatus={syncStatus} profileId={PROFILE_ID} profileName={PROFILE_NAME} />} />
        <Route path="/" element={<Navigate to="/widget" replace />} />
        <Route path="*" element={<Navigate to="/widget" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
