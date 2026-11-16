import React, { useState, useEffect } from 'react';
import type { WidgetConfig } from '../types';
import { initialConfig } from '../config';
import Widget from './Widget';
import { motion } from 'framer-motion';

interface SettingsProps {
  config: WidgetConfig;
  setConfig: React.Dispatch<React.SetStateAction<WidgetConfig>>;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig }) => {
  const [localConfig, setLocalConfig] = useState<WidgetConfig>(config);

  // Sync local state when prop changes (e.g., on initial load or external state change)
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const updateConfig = (next: WidgetConfig) => {
    setLocalConfig(next);
    setConfig(next);
  };

  const handleChange = <K extends keyof WidgetConfig>(key: K, value: WidgetConfig[K]) => {
    updateConfig({ ...localConfig, [key]: value });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-pink-300">⚙️ Настройки Виджета</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* --- Left Panel: Controls --- */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 p-6 bg-gray-800/70 rounded-xl shadow-2xl"
        >
          <h2 className="text-xl font-semibold border-b pb-2 border-pink-500/50">Конфигурация</h2>

          {/* --- Instagram Settings --- */}
          <div className="p-4 border border-pink-500/30 rounded-lg bg-gray-700/50">
            <h3 className="font-bold text-lg text-pink-300 mb-2">Instagram</h3>
            <label className="block mb-2 text-sm">Enabled: {localConfig.instagram.isEnabled ? 'Да' : 'Нет'}</label>
            <input type="checkbox" checked={localConfig.instagram.isEnabled} onChange={() => handleChange('instagram', { ...localConfig.instagram, isEnabled: !localConfig.instagram.isEnabled })} className="mr-2"/>
            <label className="block mb-2 text-sm">Username:</label>
            <input type="text" value={localConfig.instagram.username} onChange={(e) => handleChange('instagram', { ...localConfig.instagram, username: e.target.value })} className="w-full p-2 bg-gray-900 border border-pink-500/50 rounded text-white"/>
            <label className="block mb-2 text-sm">Link:</label>
            <input type="text" value={localConfig.instagram.link} onChange={(e) => handleChange('instagram', { ...localConfig.instagram, link: e.target.value })} className="w-full p-2 bg-gray-900 border border-pink-500/50 rounded text-white"/>
          </div>

          {/* --- Telegram Settings --- */}
          <div className="p-4 border border-blue-500/30 rounded-lg bg-gray-700/50">
            <h3 className="font-bold text-lg text-cyan-300 mb-2">Telegram</h3>
            <label className="block mb-2 text-sm">Enabled: {localConfig.telegram.isEnabled ? 'Да' : 'Нет'}</label>
            <input type="checkbox" checked={localConfig.telegram.isEnabled} onChange={() => handleChange('telegram', { ...localConfig.telegram, isEnabled: !localConfig.telegram.isEnabled })} className="mr-2"/>
            <label className="block mb-2 text-sm">Channel:</label>
            <input type="text" value={localConfig.telegram.username} onChange={(e) => handleChange('telegram', { ...localConfig.telegram, username: e.target.value })} className="w-full p-2 bg-gray-900 border border-blue-500/50 rounded text-white"/>
            <label className="block mb-2 text-sm">Link:</label>
            <input type="text" value={localConfig.telegram.link} onChange={(e) => handleChange('telegram', { ...localConfig.telegram, link: e.target.value })} className="w-full p-2 bg-gray-900 border border-blue-500/50 rounded text-white"/>
          </div>

          {/* --- Global Settings --- */}
          <div className="p-4 border border-purple-500/30 rounded-lg bg-gray-700/50">
            <h3 className="font-bold text-lg text-purple-300 mb-2">Глобальные настройки</h3>
            <label className="block mb-2 text-sm">Widget title:</label>
            <input
              type="text"
              value={localConfig.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-2 bg-gray-900 border border-purple-500/50 rounded text-white"
            />

            <label className="block mt-3 mb-2 text-sm">Layout mode:</label>
            <select
              value={localConfig.mode}
              onChange={(e) => handleChange('mode', e.target.value as WidgetConfig['mode'])}
              className="w-full p-2 bg-gray-900 border border-purple-500/50 rounded text-white"
            >
              <option value="horizontal">Vertical stack (cards)</option>
              <option value="vertical">Compact column</option>
            </select>

            <label className="block mt-3 mb-2 text-sm">Theme:</label>
            <select
              value={localConfig.theme}
              onChange={(e) => handleChange('theme', e.target.value as WidgetConfig['theme'])}
              className="w-full p-2 bg-gray-900 border border-purple-500/50 rounded text-white"
            >
              <option value="default">Default</option>
              <option value="pink">Pink (recommended)</option>
              <option value="lavender">Lavender</option>
              <option value="purple">Purple</option>
            </select>
            <label className="block mt-3 mb-2 text-sm">Animation Speed (ms):</label>
            <input type="number" value={localConfig.animationSpeed} onChange={(e) => handleChange('animationSpeed', parseInt(e.target.value) || 500)} className="w-full p-2 bg-gray-900 border border-purple-500/50 rounded text-white"/>
            <label className="block mt-3 mb-2 text-sm">Glow Intensity (0.0-1.0):</label>
            <input type="number" step="0.1" value={localConfig.glowIntensity} onChange={(e) => handleChange('glowIntensity', parseFloat(e.target.value) || 0.6)} className="w-full p-2 bg-gray-900 border border-purple-500/50 rounded text-white"/>
            <label className="block mt-3 mb-2 text-sm">Show Particles:</label>
            <input type="checkbox" checked={localConfig.showBackgroundParticles} onChange={() => handleChange('showBackgroundParticles', !localConfig.showBackgroundParticles)} className="mr-2"/>
          </div>

        </motion.div>

        {/* --- Right Panel: Live Preview --- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-2 rounded-xl shadow-2xl border border-gray-600/50"
          style={{ width: '100%', height: '600px' }} // Fixed height for preview consistency
        >
          <div className="h-full w-full bg-transparent">
            {/* Live Preview Widget */}
            <Widget config={localConfig} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;