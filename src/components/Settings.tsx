import React, { useState, useEffect } from 'react';
import type { WidgetConfig } from '../types';
import Widget from './Widget';
import { motion } from 'framer-motion';

interface SettingsProps {
  config: WidgetConfig;
  setConfig: React.Dispatch<React.SetStateAction<WidgetConfig>>;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig }) => {
  const [localConfig, setLocalConfig] = useState<WidgetConfig>(config);

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
    <div className="h-screen overflow-y-auto overscroll-contain bg-gray-900 text-white">
      <h1 className="mb-6 px-6 pt-6 text-center text-3xl font-bold text-pink-300">Настройки виджета</h1>

      <div className="grid grid-cols-1 items-start gap-8 px-6 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="min-w-0 space-y-6 rounded-xl bg-gray-800/70 p-6 shadow-2xl"
        >
          <h2 className="text-xl font-semibold border-b pb-2 border-pink-500/50">Конфигурация</h2>

          <div className="p-4 border border-pink-500/30 rounded-lg bg-gray-700/50">
            <h3 className="font-bold text-lg text-pink-300 mb-2">Instagram</h3>
            <label className="block mb-2 text-sm">Показывать: {localConfig.instagram.isEnabled ? 'Да' : 'Нет'}</label>
            <input type="checkbox" checked={localConfig.instagram.isEnabled} onChange={() => handleChange('instagram', { ...localConfig.instagram, isEnabled: !localConfig.instagram.isEnabled })} className="mr-2"/>
            <label className="block mb-2 text-sm">Имя пользователя:</label>
            <input type="text" value={localConfig.instagram.username} onChange={(e) => handleChange('instagram', { ...localConfig.instagram, username: e.target.value })} className="w-full p-2 bg-gray-900 border border-pink-500/50 rounded text-white"/>
            <label className="block mb-2 text-sm">Ссылка:</label>
            <input type="url" value={localConfig.instagram.link} onChange={(e) => handleChange('instagram', { ...localConfig.instagram, link: e.target.value })} className="w-full p-2 bg-gray-900 border border-pink-500/50 rounded text-white"/>
          </div>

          <div className="p-4 border border-blue-500/30 rounded-lg bg-gray-700/50">
            <h3 className="font-bold text-lg text-cyan-300 mb-2">Telegram</h3>
            <label className="block mb-2 text-sm">Показывать: {localConfig.telegram.isEnabled ? 'Да' : 'Нет'}</label>
            <input type="checkbox" checked={localConfig.telegram.isEnabled} onChange={() => handleChange('telegram', { ...localConfig.telegram, isEnabled: !localConfig.telegram.isEnabled })} className="mr-2"/>
            <label className="block mb-2 text-sm">Имя пользователя:</label>
            <input type="text" value={localConfig.telegram.username} onChange={(e) => handleChange('telegram', { ...localConfig.telegram, username: e.target.value })} className="w-full p-2 bg-gray-900 border border-blue-500/50 rounded text-white"/>
            <label className="block mb-2 text-sm">Ссылка:</label>
            <input type="url" value={localConfig.telegram.link} onChange={(e) => handleChange('telegram', { ...localConfig.telegram, link: e.target.value })} className="w-full p-2 bg-gray-900 border border-blue-500/50 rounded text-white"/>
          </div>

          <div className="p-4 border border-violet-500/30 rounded-lg bg-gray-700/50">
            <h3 className="font-bold text-lg text-violet-300 mb-2">Сайт</h3>
            <label className="block mb-2 text-sm">Показывать: {localConfig.website.isEnabled ? 'Да' : 'Нет'}</label>
            <input type="checkbox" checked={localConfig.website.isEnabled} onChange={() => handleChange('website', { ...localConfig.website, isEnabled: !localConfig.website.isEnabled })} className="mr-2" />
            <label className="block mb-2 text-sm">Название:</label>
            <input type="text" value={localConfig.website.username} onChange={(e) => handleChange('website', { ...localConfig.website, username: e.target.value })} className="w-full p-2 bg-gray-900 border border-violet-500/50 rounded text-white" />
            <label className="block mb-2 text-sm">Ссылка:</label>
            <input type="url" value={localConfig.website.link} onChange={(e) => handleChange('website', { ...localConfig.website, link: e.target.value })} className="w-full p-2 bg-gray-900 border border-violet-500/50 rounded text-white" />
          </div>

          <div className="p-4 border border-purple-500/30 rounded-lg bg-gray-700/50">
            <h3 className="font-bold text-lg text-purple-300 mb-2">Глобальные настройки</h3>
            <label className="block mb-2 text-sm">Заголовок виджета:</label>
            <input type="text" value={localConfig.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full p-2 bg-gray-900 border border-purple-500/50 rounded text-white"/>

            <label className="block mt-3 mb-2 text-sm">Расположение:</label>
            <select value={localConfig.mode} onChange={(e) => handleChange('mode', e.target.value as WidgetConfig['mode'])} className="w-full p-2 bg-gray-900 border border-purple-500/50 rounded text-white">
              <option value="horizontal">Горизонтально</option>
              <option value="vertical">Вертикально</option>
            </select>

            <label className="block mt-3 mb-2 text-sm">Тема:</label>
            <select value={localConfig.theme} onChange={(e) => handleChange('theme', e.target.value as WidgetConfig['theme'])} className="w-full p-2 bg-gray-900 border border-purple-500/50 rounded text-white">
              <option value="default">Стандартная</option>
              <option value="pink">Розовая</option>
              <option value="lavender">Лавандовая</option>
              <option value="purple">Фиолетовая</option>
            </select>

            <div className="mt-5 space-y-4 rounded-lg border border-pink-500/30 bg-gray-900/50 p-4">
              <h4 className="font-semibold text-pink-200">Размер карточек</h4>

              <div>
                <label className="mb-1 flex justify-between text-sm">
                  <span>Ширина</span><span>{localConfig.cardWidth} px</span>
                </label>
                <input type="range" min="140" max="260" step="5" value={localConfig.cardWidth}
                  onChange={(e) => handleChange('cardWidth', Number(e.target.value))} className="w-full accent-pink-400" />
              </div>

              <div>
                <label className="mb-1 flex justify-between text-sm">
                  <span>Высота</span><span>{localConfig.cardHeight} px</span>
                </label>
                <input type="range" min="40" max="80" step="2" value={localConfig.cardHeight}
                  onChange={(e) => handleChange('cardHeight', Number(e.target.value))} className="w-full accent-pink-400" />
              </div>

              <div>
                <label className="mb-1 flex justify-between text-sm">
                  <span>Размер иконок</span><span>{localConfig.iconSize} px</span>
                </label>
                <input type="range" min="12" max="24" step="1" value={localConfig.iconSize}
                  onChange={(e) => handleChange('iconSize', Number(e.target.value))} className="w-full accent-pink-400" />
              </div>

              <div>
                <label className="mb-1 flex justify-between text-sm">
                  <span>Размер текста</span><span>{localConfig.textSize} px</span>
                </label>
                <input type="range" min="10" max="18" step="1" value={localConfig.textSize}
                  onChange={(e) => handleChange('textSize', Number(e.target.value))} className="w-full accent-pink-400" />
              </div>
            </div>

            <label className="block mt-3 mb-2 text-sm">Скорость анимации (секунды):</label>
            <input type="number" min="0.1" max="3" step="0.1" value={localConfig.animationSpeed} onChange={(e) => handleChange('animationSpeed', Math.min(3, Math.max(0.1, Number(e.target.value) || 0.6)))} className="w-full p-2 bg-gray-900 border border-purple-500/50 rounded text-white"/>

            <label className="block mt-3 mb-2 text-sm">Интенсивность свечения (0–1):</label>
            <input type="number" min="0" max="1" step="0.1" value={localConfig.glowIntensity} onChange={(e) => handleChange('glowIntensity', Math.min(1, Math.max(0, Number(e.target.value) || 0)))} className="w-full p-2 bg-gray-900 border border-purple-500/50 rounded text-white"/>

            <label className="block mt-3 mb-2 text-sm">Фоновые частицы:</label>
            <input type="checkbox" checked={localConfig.showBackgroundParticles} onChange={() => handleChange('showBackgroundParticles', !localConfig.showBackgroundParticles)} className="mr-2"/>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="min-w-0 lg:sticky lg:top-1/2 lg:-translate-y-1/2 lg:self-start"
        >
          <div className="rounded-xl border border-pink-400/30 bg-gray-800/80 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between border-b border-gray-600/60 pb-3">
              <div>
                <h2 className="font-semibold text-pink-200">Live Preview</h2>
                <p className="text-xs text-gray-400">Предпросмотр виджета в реальном времени</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-300">LIVE</span>
            </div>
            <div className="flex min-h-[260px] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-600/70 bg-black/20 p-4">
              <Widget config={localConfig} />
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default Settings;
