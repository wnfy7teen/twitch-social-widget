import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Widget from './components/Widget';
import Settings from './components/Settings';
import { initialConfig, type WidgetConfig } from './config';

const STORAGE_KEY = 'widgetConfig';
const LEGACY_STORAGE_KEY = 'twitch-social-widget-config-v1';

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

function loadConfig(): WidgetConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return initialConfig;
    const parsed = JSON.parse(raw);
    return deepMerge(initialConfig, parsed);
  } catch {
    return initialConfig;
  }
}

const App: React.FC = () => {
  const [config, setConfig] = useState<WidgetConfig>(() => loadConfig());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }, [config]);

  const widgetElement = useMemo(() => <Widget config={config} />, [config]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/widget" element={widgetElement} />
        <Route path="/settings" element={<Settings config={config} setConfig={setConfig} />} />
        <Route path="/" element={<Navigate to="/widget" replace />} />
        <Route path="*" element={<Navigate to="/widget" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
