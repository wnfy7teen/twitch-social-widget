import React, { useEffect, useState } from 'react';
import type { WidgetConfig, SocialMediaConfig } from '../types';
import { defaultCardSizes, initialConfig } from '../config';
import Widget from './Widget';
import {
  Globe2, Instagram, Send, RotateCcw, Eye, SlidersHorizontal,
  Monitor, Sparkles, Check, ExternalLink,
} from 'lucide-react';

interface SettingsProps {
  config: WidgetConfig;
  setConfig: React.Dispatch<React.SetStateAction<WidgetConfig>>;
}

type SocialKey = 'instagram' | 'telegram' | 'website';

const inputClass = "mt-1.5 w-full rounded-lg border border-[#dedbd6] bg-white px-3 py-2.5 text-sm text-[#262522] outline-none transition placeholder:text-[#aaa69f] hover:border-[#bdb8b0] focus:border-[#8d6674] focus:ring-2 focus:ring-[#8d6674]/10";
const selectClass = inputClass + " cursor-pointer";

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b777f]">{eyebrow}</p>
      <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.025em] text-[#292825]">{title}</h2>
      {description && <p className="mt-1 text-[13px] leading-5 text-[#858078]">{description}</p>}
    </div>
  );
}

function RangeControl({ label, value, min, max, step, suffix, onChange }: {
  label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-[13px] font-medium text-[#514e48]">{label}</label>
        <span className="min-w-[54px] rounded-md bg-[#f3f0ed] px-2 py-1 text-right text-xs font-semibold tabular-nums text-[#5f5854]">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="settings-range w-full cursor-pointer" />
      <div className="mt-1 flex justify-between text-[10px] text-[#aaa49b]"><span>{min}{suffix}</span><span>{max}{suffix}</span></div>
    </div>
  );
}

const socialMeta: Record<SocialKey, { title: string; description: string; icon: React.ElementType; accent: string }> = {
  instagram: { title: 'Instagram', description: 'Профиль Instagram', icon: Instagram, accent: '#b66d86' },
  telegram: { title: 'Telegram', description: 'Канал или личный профиль', icon: Send, accent: '#648eaa' },
  website: { title: 'Сайт', description: 'Личный сайт или портфолио', icon: Globe2, accent: '#8c829f' },
};

const Settings: React.FC<SettingsProps> = ({ config, setConfig }) => {
  const [localConfig, setLocalConfig] = useState<WidgetConfig>(config);

  useEffect(() => setLocalConfig(config), [config]);

  const updateConfig = (next: WidgetConfig) => {
    setLocalConfig(next);
    setConfig(next);
  };

  const handleChange = <K extends keyof WidgetConfig>(key: K, value: WidgetConfig[K]) => {
    updateConfig({ ...localConfig, [key]: value });
  };

  const updateSocial = (key: SocialKey, patch: Partial<SocialMediaConfig>) => {
    updateConfig({ ...localConfig, [key]: { ...localConfig[key], ...patch } });
  };

  const resetAll = () => updateConfig({
    ...initialConfig,
    instagram: { ...initialConfig.instagram },
    telegram: { ...initialConfig.telegram },
    website: { ...initialConfig.website },
  });

  const enabledCount = [localConfig.instagram, localConfig.telegram, localConfig.website].filter((item) => item.isEnabled).length;

  return (
    <div className="settings-shell min-h-screen text-[#292825]">
      <header className="sticky top-0 z-30 border-b border-[#e8e4de] bg-[#f8f7f4]/95 backdrop-blur">
        <div className="mx-auto flex h-[66px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#302d2c] text-white">
              <span className="text-[15px] font-semibold tracking-[-0.08em]">vf</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-[#302d2c]">Social Widget</p>
              <p className="text-[10px] tracking-[0.08em] text-[#99938a]">CREATOR TOOLS</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#e5e1db] bg-white px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6d9a7d]" />
            <span className="text-[11px] font-medium text-[#77736c]">Изменения сохраняются автоматически</span>
            <Check size={13} className="ml-1 text-[#6d9a7d]" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 lg:pt-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-[#918980]">
              <span>WORKSPACE</span><span className="text-[#c6c0b7]">/</span><span className="text-[#6f6961]">WIDGET SETTINGS</span>
            </div>
            <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.045em] text-[#292825] sm:text-[36px]">Настройки виджета</h1>
            <p className="mt-2 max-w-xl text-[14px] leading-6 text-[#817c74]">Настройте ссылки и внешний вид блока, который появится в вашей трансляции.</p>
          </div>
          <button type="button" onClick={resetAll}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-[#ded9d2] bg-white px-3.5 text-[12px] font-medium text-[#625d56] shadow-sm transition hover:border-[#c9b8bc] hover:bg-[#fbf7f7] hover:text-[#8b596a] sm:self-auto">
            <RotateCcw size={14} /> Сбросить все настройки
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.88fr)]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#e8e4de] bg-white p-5 shadow-[0_2px_12px_rgba(39,34,29,0.025)] sm:p-6">
              <SectionHeading eyebrow="01 / ACCOUNTS" title="Социальные сети" description="Укажите адреса профилей, которые хотите показывать зрителям." />
              <div className="space-y-3">
                {(Object.keys(socialMeta) as SocialKey[]).map((key) => {
                  const meta = socialMeta[key];
                  const Icon = meta.icon;
                  const item = localConfig[key];
                  return (
                    <div key={key} className="rounded-xl border border-[#ece9e4] bg-[#fdfcfb] p-4 transition-colors hover:border-[#ded8d2]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.07)]" style={{ color: meta.accent }}>
                            <Icon size={17} strokeWidth={1.8} />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#393631]">{meta.title}</p>
                            <p className="mt-0.5 text-[11px] text-[#969087]">{meta.description}</p>
                          </div>
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-2">
                          <span className="text-[11px] text-[#817b73]">{item.isEnabled ? 'Включено' : 'Скрыто'}</span>
                          <input type="checkbox" checked={item.isEnabled} onChange={(event) => updateSocial(key, { isEnabled: event.target.checked })} className="settings-toggle" />
                        </label>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="block min-w-0">
                          <span className="text-[11px] font-medium text-[#777169]">{key === 'website' ? 'Название' : 'Имя пользователя'}</span>
                          <input type="text" value={item.username} onChange={(event) => updateSocial(key, { username: event.target.value })} className={inputClass} placeholder="Введите имя" />
                        </label>
                        <label className="block min-w-0">
                          <span className="text-[11px] font-medium text-[#777169]">Ссылка</span>
                          <input type="url" value={item.link} onChange={(event) => updateSocial(key, { link: event.target.value })} className={inputClass} placeholder="https://" />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e8e4de] bg-white p-5 shadow-[0_2px_12px_rgba(39,34,29,0.025)] sm:p-6">
              <SectionHeading eyebrow="02 / LAYOUT" title="Внешний вид" description="Общие параметры оформления и расположения блока." />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12px] font-medium text-[#6f6961]">Заголовок</span>
                  <input type="text" value={localConfig.title} onChange={(event) => handleChange('title', event.target.value)} className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-[12px] font-medium text-[#6f6961]">Расположение</span>
                  <select value={localConfig.mode} onChange={(event) => handleChange('mode', event.target.value as WidgetConfig['mode'])} className={selectClass}>
                    <option value="horizontal">В одну линию</option>
                    <option value="vertical">Вертикально</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[12px] font-medium text-[#6f6961]">Цветовая тема</span>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {([
                      ['default', 'Графитовая', '#69717d'],
                      ['pink', 'Розовая', '#c27b98'],
                      ['lavender', 'Лавандовая', '#9286bd'],
                      ['purple', 'Фиолетовая', '#755b9e'],
                    ] as const).map(([value, label, color]) => (
                      <button key={value} type="button" onClick={() => handleChange('theme', value)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[11px] font-medium transition ${localConfig.theme === value ? 'border-[#9c7884] bg-[#fbf6f7] text-[#654b54] ring-1 ring-[#9c7884]/20' : 'border-[#e8e4de] bg-white text-[#777169] hover:border-[#cfc8bf]'}`}>
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />{label}
                      </button>
                    ))}
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e8e4de] bg-white p-5 shadow-[0_2px_12px_rgba(39,34,29,0.025)] sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <SectionHeading eyebrow="03 / DIMENSIONS" title="Размеры карточек" description="Точная подгонка под композицию вашей сцены в OBS." />
                <button type="button" onClick={() => updateConfig({ ...localConfig, ...defaultCardSizes })}
                  className="mb-5 inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-[#8b6875] transition hover:text-[#624653]">
                  <RotateCcw size={12} /> Сбросить
                </button>
              </div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <RangeControl label="Ширина карточки" value={localConfig.cardWidth} min={140} max={260} step={5} suffix=" px" onChange={(value) => handleChange('cardWidth', value)} />
                <RangeControl label="Высота карточки" value={localConfig.cardHeight} min={40} max={80} step={2} suffix=" px" onChange={(value) => handleChange('cardHeight', value)} />
                <RangeControl label="Размер иконки" value={localConfig.iconSize} min={12} max={24} step={1} suffix=" px" onChange={(value) => handleChange('iconSize', value)} />
                <RangeControl label="Размер текста" value={localConfig.textSize} min={10} max={18} step={1} suffix=" px" onChange={(value) => handleChange('textSize', value)} />
              </div>
            </section>

            <section className="rounded-2xl border border-[#e8e4de] bg-white p-5 shadow-[0_2px_12px_rgba(39,34,29,0.025)] sm:p-6">
              <SectionHeading eyebrow="04 / MOTION" title="Анимация и эффекты" description="Настройте характер появления карточек и интенсивность подсветки." />
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <RangeControl label="Длительность анимации" value={localConfig.animationSpeed} min={0.1} max={3} step={0.1} suffix=" с" onChange={(value) => handleChange('animationSpeed', value)} />
                <RangeControl label="Интенсивность свечения" value={Math.round(localConfig.glowIntensity * 100)} min={0} max={100} step={5} suffix="%" onChange={(value) => handleChange('glowIntensity', value / 100)} />
              </div>
              <div className="mt-5 flex flex-col gap-3 border-t border-[#efede9] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[12px] font-medium text-[#514e48]">Фоновые частицы</p>
                  <p className="mt-0.5 text-[11px] text-[#969087]">Ненавязчивое движение на заднем плане</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <span className="text-[11px] text-[#817b73]">{localConfig.showBackgroundParticles ? 'Включены' : 'Выключены'}</span>
                  <input type="checkbox" checked={localConfig.showBackgroundParticles} onChange={(event) => handleChange('showBackgroundParticles', event.target.checked)} className="settings-toggle" />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e8e4de] bg-white p-5 shadow-[0_2px_12px_rgba(39,34,29,0.025)] sm:p-6">
              <SectionHeading eyebrow="05 / VISIBILITY" title="Поведение виджета" description="Автоматическое скрытие и повторное появление во время трансляции." />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-[#514e48]">Автоматически скрывать виджет</p>
                  <p className="mt-1 text-[11px] text-[#969087]">Виджет будет периодически исчезать с экрана</p>
                </div>
                <input type="checkbox" checked={localConfig.autoHide} onChange={(event) => handleChange('autoHide', event.target.checked)} className="settings-toggle" />
              </div>
              {localConfig.autoHide && (
                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#efede9] pt-4 sm:grid-cols-3">
                  <label><span className="text-[11px] text-[#777169]">Задержка старта, сек.</span><input type="number" min="0" value={localConfig.autoHideDelay} onChange={(event) => handleChange('autoHideDelay', Math.max(0, Number(event.target.value)))} className={inputClass} /></label>
                  <label><span className="text-[11px] text-[#777169]">Показывать, сек.</span><input type="number" min="1" value={localConfig.showDuration} onChange={(event) => handleChange('showDuration', Math.max(1, Number(event.target.value)))} className={inputClass} /></label>
                  <label><span className="text-[11px] text-[#777169]">Скрывать, сек.</span><input type="number" min="1" value={localConfig.hideDuration} onChange={(event) => handleChange('hideDuration', Math.max(1, Number(event.target.value)))} className={inputClass} /></label>
                </div>
              )}
            </section>
          </div>

          <aside className="xl:sticky xl:top-[88px]">
            <div className="overflow-hidden rounded-2xl border border-[#e5e1da] bg-white shadow-[0_8px_30px_rgba(39,34,29,0.055)]">
              <div className="flex items-center justify-between border-b border-[#efede9] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f0ed] text-[#77636a]"><Eye size={15} /></div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#393631]">Предпросмотр</p>
                    <p className="mt-0.5 text-[10px] text-[#99938a]">Обновляется в реальном времени</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#edf4ee] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#64836b]">LIVE</span>
              </div>
              <div className="preview-stage relative flex min-h-[300px] items-center justify-center overflow-hidden p-6">
                <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white/35"><Monitor size={11} /> OBS canvas</div>
                <div className="relative z-10 max-w-full">
                  <Widget config={localConfig} />
                </div>
                <div className="pointer-events-none absolute bottom-3 right-4 text-[9px] tabular-nums text-white/35">{localConfig.cardWidth} × {localConfig.cardHeight} px</div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-[#efede9] border-t border-[#efede9] bg-[#fdfcfb]">
                <div className="px-3 py-3 text-center"><p className="text-[17px] font-semibold tracking-tight text-[#393631]">{enabledCount}<span className="ml-1 text-[11px] font-normal text-[#99938a]">/ 3</span></p><p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-[#99938a]">Платформы</p></div>
                <div className="px-3 py-3 text-center"><p className="text-[17px] font-semibold tracking-tight text-[#393631]">{localConfig.mode === 'horizontal' ? 'Ряд' : 'Столбец'}</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-[#99938a]">Расположение</p></div>
                <div className="px-3 py-3 text-center"><p className="text-[17px] font-semibold tracking-tight text-[#393631]">{localConfig.glowIntensity === 0 ? 'Выкл.' : `${Math.round(localConfig.glowIntensity * 100)}%`}</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-[#99938a]">Свечение</p></div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#e8e4de] bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f4f0ed] text-[#8b6875]"><SlidersHorizontal size={14} /></div>
                <div>
                  <p className="text-[12px] font-semibold text-[#514e48]">Подключение к OBS</p>
                  <p className="mt-1 text-[11px] leading-5 text-[#89837b]">Добавьте страницу виджета как Browser Source. Настройки сохраняются автоматически в этом браузере.</p>
                  <a href="/widget" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8b6875] hover:text-[#654b54]">Открыть страницу виджета <ExternalLink size={11} /></a>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-[#aaa49b]"><Sparkles size={11} /> Сделано для аккуратной сцены</div>
          </aside>
        </div>
        <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-[#e8e4de] pt-5 text-[10px] text-[#aaa49b] sm:flex-row">
          <span>Social Widget · Creator tools</span><span>Настройки сохраняются автоматически</span>
        </footer>
      </main>
    </div>
  );
};

export default Settings;
