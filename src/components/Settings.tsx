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
  syncStatus: 'connecting' | 'connected' | 'saving' | 'error' | 'not-configured';
  profileId: 'default' | 'domentos';
  profileName: string;
}

type SocialKey = 'instagram' | 'telegram' | 'website';

const inputClass = "mt-1.5 w-full rounded-lg border border-[#41403e] bg-[#302f2d] px-3 py-2.5 text-sm text-[#e9e6e1] outline-none transition placeholder:text-[#817d77] hover:border-[#55524f] focus:border-[#a77d8a] focus:ring-2 focus:ring-[#a77d8a]/10";
const selectClass = inputClass + " cursor-pointer";

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b98d9a]">{eyebrow}</p>
      <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.025em] text-[#e9e6e1]">{title}</h2>
      {description && <p className="mt-1 text-[13px] leading-5 text-[#a29c93]">{description}</p>}
    </div>
  );
}

function RangeControl({ label, value, min, max, step, suffix, onChange }: {
  label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-[13px] font-medium text-[#d1cbc3]">{label}</label>
        <span className="min-w-[54px] rounded-md bg-[#302f2d] px-2 py-1 text-right text-xs font-semibold tabular-nums text-[#d2ccc5]">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="settings-range w-full cursor-pointer" />
      <div className="mt-1 flex justify-between text-[10px] text-[#77736d]"><span>{min}{suffix}</span><span>{max}{suffix}</span></div>
    </div>
  );
}

const socialMeta: Record<SocialKey, { title: string; description: string; icon: React.ElementType; accent: string }> = {
  instagram: { title: 'Instagram', description: 'Профиль Instagram', icon: Instagram, accent: '#b66d86' },
  telegram: { title: 'Telegram', description: 'Канал или личный профиль', icon: Send, accent: '#648eaa' },
  website: { title: 'Сайт', description: 'Личный сайт или портфолио', icon: Globe2, accent: '#8c829f' },
};

const Settings: React.FC<SettingsProps> = ({ config, setConfig, syncStatus, profileId, profileName }) => {
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
    <div className="settings-shell h-screen overflow-y-auto overscroll-contain text-[#e9e6e1]">
      <header className="sticky top-0 z-30 border-b border-[#383735] bg-[#1b1b1a]/95 backdrop-blur">
        <div className="mx-auto flex h-[66px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#292826] text-white">
              <span className="text-[15px] font-semibold tracking-[-0.08em]">vf</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-[#e9e6e1]">Social Widget</p>
              <p className="text-[10px] tracking-[0.08em] text-[#c092a0]">{profileName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[11px] text-[#aaa39a]">
              <span className="hidden sm:inline">Профиль</span>
              <select value={profileId} onChange={(event) => { window.location.href = `/settings${event.target.value === 'default' ? '' : `?profile=${event.target.value}`}`; }} className="rounded-lg border border-[#45423f] bg-[#302f2d] px-2.5 py-2 text-[11px] font-medium text-[#e9e6e1] outline-none focus:border-[#a77d8a]">
                <option value="default">Основной</option>
                <option value="domentos">Domentos</option>
              </select>
            </label>
            <div className="flex items-center gap-2 rounded-full border border-[#3b3937] bg-[#302f2d] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#83a88e]" />
            <span className="text-[11px] font-medium text-[#b2aca4]">{syncStatus === 'connected' ? 'Облачная синхронизация активна' : syncStatus === 'saving' ? 'Сохраняем изменения…' : syncStatus === 'connecting' ? 'Подключаем облако…' : syncStatus === 'error' ? 'Ошибка облачной синхронизации' : 'Ожидает настройки облака'}</span>
            {syncStatus === 'connected' ? <Check size={13} className="ml-1 text-[#83a88e]" /> : <span className={`ml-1 h-1.5 w-1.5 rounded-full ${syncStatus === 'error' ? 'bg-[#d27c7c]' : syncStatus === 'saving' ? 'bg-[#d5b56f]' : 'bg-[#918980]'}`} />}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 lg:pt-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-[#918980]">
              <span>WORKSPACE</span><span className="text-[#c6c0b7]">/</span><span className="text-[#b5aea5]">WIDGET SETTINGS</span>
            </div>
            <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.045em] text-[#e9e6e1] sm:text-[36px]">Настройки виджета</h1>
            <p className="mt-2 max-w-xl text-[14px] leading-6 text-[#a29c93]">Настройте ссылки и внешний вид блока, который появится в вашей трансляции.</p>
          </div>
          <button type="button" onClick={resetAll}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-[#45423f] bg-[#302f2d] px-3.5 text-[12px] font-medium text-[#d1cbc3] shadow-sm transition hover:border-[#71515d] hover:bg-[#30292b] hover:text-[#c18c9d] sm:self-auto">
            <RotateCcw size={14} /> Сбросить все настройки
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.88fr)]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#383735] bg-[#262624] p-5 shadow-[0_2px_12px_rgba(39,34,29,0.025)] sm:p-6">
              <SectionHeading eyebrow="01 / ACCOUNTS" title="Социальные сети" description="Укажите адреса профилей, которые хотите показывать зрителям." />
              <div className="space-y-3">
                {(Object.keys(socialMeta) as SocialKey[]).map((key) => {
                  const meta = socialMeta[key];
                  const Icon = meta.icon;
                  const item = localConfig[key];
                  return (
                    <div key={key} className="rounded-xl border border-[#3a3936] bg-[#262624] p-4 transition-colors hover:border-[#55514c]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#343230] shadow-[0_1px_3px_rgba(0,0,0,0.18)]" style={{ color: meta.accent }}>
                            <Icon size={17} strokeWidth={1.8} />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#e3dfd8]">{meta.title}</p>
                            <p className="mt-0.5 text-[11px] text-[#99938b]">{meta.description}</p>
                          </div>
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-2">
                          <span className="text-[11px] text-[#aaa39a]">{item.isEnabled ? 'Включено' : 'Скрыто'}</span>
                          <input type="checkbox" checked={item.isEnabled} onChange={(event) => updateSocial(key, { isEnabled: event.target.checked })} className="settings-toggle" />
                        </label>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="block min-w-0">
                          <span className="text-[11px] font-medium text-[#b4ada4]">{key === 'website' ? 'Название' : 'Имя пользователя'}</span>
                          <input type="text" value={item.username} onChange={(event) => updateSocial(key, { username: event.target.value })} className={inputClass} placeholder="Введите имя" />
                        </label>
                        <label className="block min-w-0">
                          <span className="text-[11px] font-medium text-[#b4ada4]">Ссылка</span>
                          <input type="url" value={item.link} onChange={(event) => updateSocial(key, { link: event.target.value })} className={inputClass} placeholder="https://" />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-[#383735] bg-[#262624] p-5 shadow-[0_2px_12px_rgba(39,34,29,0.025)] sm:p-6">
              <SectionHeading eyebrow="02 / LAYOUT" title="Внешний вид" description="Общие параметры оформления и расположения блока." />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12px] font-medium text-[#b5aea5]">Заголовок</span>
                  <input type="text" value={localConfig.title} onChange={(event) => handleChange('title', event.target.value)} className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-[12px] font-medium text-[#b5aea5]">Расположение</span>
                  <select value={localConfig.mode} onChange={(event) => handleChange('mode', event.target.value as WidgetConfig['mode'])} className={selectClass}>
                    <option value="horizontal">В одну линию</option>
                    <option value="vertical">Вертикально</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[12px] font-medium text-[#b5aea5]">Цветовая тема</span>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {([
                      ['default', 'Графитовая', '#69717d'],
                      ['pink', 'Розовая', '#c27b98'],
                      ['lavender', 'Лавандовая', '#9286bd'],
                      ['purple', 'Фиолетовая', '#755b9e'],
                    ] as const).map(([value, label, color]) => (
                      <button key={value} type="button" onClick={() => handleChange('theme', value)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[11px] font-medium transition ${localConfig.theme === value ? 'border-[#9c7884] bg-[#382e32] text-[#d2a7b3] ring-1 ring-[#9c7884]/20' : 'border-[#383735] bg-[#302f2d] text-[#b4ada4] hover:border-[#77716a]'}`}>
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />{label}
                      </button>
                    ))}
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#383735] bg-[#262624] p-5 shadow-[0_2px_12px_rgba(39,34,29,0.025)] sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <SectionHeading eyebrow="03 / DIMENSIONS" title="Размеры карточек" description="Точная подгонка под композицию вашей сцены в OBS." />
                <button type="button" onClick={() => updateConfig({ ...localConfig, ...defaultCardSizes })}
                  className="mb-5 inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-[#c092a0] transition hover:text-[#624653]">
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

            <section className="rounded-2xl border border-[#383735] bg-[#262624] p-5 shadow-[0_2px_12px_rgba(39,34,29,0.025)] sm:p-6">
              <SectionHeading eyebrow="04 / MOTION" title="Анимация и эффекты" description="Настройте характер появления карточек и интенсивность подсветки." />
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <RangeControl label="Длительность анимации" value={localConfig.animationSpeed} min={0.1} max={3} step={0.1} suffix=" с" onChange={(value) => handleChange('animationSpeed', value)} />
                <RangeControl label="Интенсивность свечения" value={Math.round(localConfig.glowIntensity * 100)} min={0} max={100} step={5} suffix="%" onChange={(value) => handleChange('glowIntensity', value / 100)} />
              </div>
              <div className="mt-5 flex flex-col gap-3 border-t border-[#393836] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[12px] font-medium text-[#d1cbc3]">Фоновые частицы</p>
                  <p className="mt-0.5 text-[11px] text-[#99938b]">Ненавязчивое движение на заднем плане</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <span className="text-[11px] text-[#aaa39a]">{localConfig.showBackgroundParticles ? 'Включены' : 'Выключены'}</span>
                  <input type="checkbox" checked={localConfig.showBackgroundParticles} onChange={(event) => handleChange('showBackgroundParticles', event.target.checked)} className="settings-toggle" />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#383735] bg-[#262624] p-5 shadow-[0_2px_12px_rgba(39,34,29,0.025)] sm:p-6">
              <SectionHeading eyebrow="05 / VISIBILITY" title="Поведение виджета" description="Автоматическое скрытие и повторное появление во время трансляции." />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-[#d1cbc3]">Автоматически скрывать виджет</p>
                  <p className="mt-1 text-[11px] text-[#99938b]">Виджет будет периодически исчезать с экрана</p>
                </div>
                <input type="checkbox" checked={localConfig.autoHide} onChange={(event) => handleChange('autoHide', event.target.checked)} className="settings-toggle" />
              </div>
              {localConfig.autoHide && (
                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#393836] pt-4 sm:grid-cols-3">
                  <label><span className="text-[11px] text-[#b4ada4]">Задержка старта, сек.</span><input type="number" min="0" value={localConfig.autoHideDelay} onChange={(event) => handleChange('autoHideDelay', Math.max(0, Number(event.target.value)))} className={inputClass} /></label>
                  <label><span className="text-[11px] text-[#b4ada4]">Показывать, сек.</span><input type="number" min="1" value={localConfig.showDuration} onChange={(event) => handleChange('showDuration', Math.max(1, Number(event.target.value)))} className={inputClass} /></label>
                  <label><span className="text-[11px] text-[#b4ada4]">Скрывать, сек.</span><input type="number" min="1" value={localConfig.hideDuration} onChange={(event) => handleChange('hideDuration', Math.max(1, Number(event.target.value)))} className={inputClass} /></label>
                </div>
              )}
            </section>
          </div>

          <aside className="xl:sticky xl:top-[88px]">
            <div className="overflow-hidden rounded-2xl border border-[#3c3a38] bg-[#262624] shadow-[0_8px_30px_rgba(39,34,29,0.055)]">
              <div className="flex items-center justify-between border-b border-[#393836] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#33312f] text-[#77636a]"><Eye size={15} /></div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#e3dfd8]">Предпросмотр</p>
                    <p className="mt-0.5 text-[10px] text-[#89847d]">Обновляется в реальном времени</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#2e3b31] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#9bb9a1]">LIVE</span>
              </div>
              <div className="preview-stage relative flex min-h-[300px] w-full items-center justify-center overflow-hidden p-6">
                <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white/35"><Monitor size={11} /> OBS canvas</div>
                <div className="relative z-10 max-w-full">
                  <Widget config={localConfig} />
                </div>
                <div className="pointer-events-none absolute bottom-3 right-4 text-[9px] tabular-nums text-white/35">{localConfig.cardWidth} × {localConfig.cardHeight} px</div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-[#393836] border-t border-[#393836] bg-[#262624]">
                <div className="px-3 py-3 text-center"><p className="text-[17px] font-semibold tracking-tight text-[#e3dfd8]">{enabledCount}<span className="ml-1 text-[11px] font-normal text-[#89847d]">/ 3</span></p><p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-[#89847d]">Платформы</p></div>
                <div className="px-3 py-3 text-center"><p className="text-[17px] font-semibold tracking-tight text-[#e3dfd8]">{localConfig.mode === 'horizontal' ? 'Ряд' : 'Столбец'}</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-[#89847d]">Расположение</p></div>
                <div className="px-3 py-3 text-center"><p className="text-[17px] font-semibold tracking-tight text-[#e3dfd8]">{localConfig.glowIntensity === 0 ? 'Выкл.' : `${Math.round(localConfig.glowIntensity * 100)}%`}</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-[#89847d]">Свечение</p></div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#383735] bg-[#262624] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#33312f] text-[#c092a0]"><SlidersHorizontal size={14} /></div>
                <div>
                  <p className="text-[12px] font-semibold text-[#d1cbc3]">Подключение к OBS</p>
                  <p className="mt-1 text-[11px] leading-5 text-[#a29b92]">Добавьте страницу виджета как Browser Source. Настройки сохраняются автоматически в этом браузере.</p>
                  <a href={`/widget${profileId === 'default' ? '' : `?profile=${profileId}`}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#c092a0] hover:text-[#d2a7b3]">Открыть страницу виджета <ExternalLink size={11} /></a>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-[#77736d]"><Sparkles size={11} /> Сделано для аккуратной сцены</div>
          </aside>
        </div>
        <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-[#383735] pt-5 text-[10px] text-[#77736d] sm:flex-row">
          <span>© 2026 Kristofer Biksan · Разработчик</span><span>Все права защищены</span>
        </footer>
      </main>
    </div>
  );
};

export default Settings;
