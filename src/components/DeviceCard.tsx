import { useState } from 'react';
import { Device } from '../types';
import { Lightbulb, Thermometer, Video, Blinds, Wind, Speaker, Power, WifiOff, Clock } from 'lucide-react';

interface Props {
  device: Device;
  onToggle: (id: string) => void;
  onBrightness?: (id: string, val: number) => void;
  onTemperature?: (id: string, val: number) => void;
  onACMode?: (id: string, mode: Device['acMode']) => void;
  onOpenTimer?: (id: string) => void;
  timerCount?: number;
}

const typeIcon: Record<Device['type'], React.ElementType> = {
  light: Lightbulb,
  ac: Thermometer,
  camera: Video,
  curtain: Blinds,
  purifier: Wind,
  speaker: Speaker,
};

const modeLabel: Record<string, string> = {
  cool: '制冷',
  heat: '制热',
  dry: '除湿',
  fan: '送风',
};

export default function DeviceCard({ device, onToggle, onBrightness, onTemperature, onACMode, onOpenTimer, timerCount }: Props) {
  const [pulse, setPulse] = useState(false);
  const Icon = typeIcon[device.type];
  const isOffline = !device.online;

  const handleToggle = () => {
    if (isOffline) return;
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
    onToggle(device.id);
  };

  return (
    <div className={`relative p-4 rounded-xl border transition-all ${
      isOffline
        ? 'bg-slate-800/50 border-slate-700 opacity-60'
        : 'bg-slate-800 border-slate-700'
    }`}>
      {isOffline && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-slate-500">
          <WifiOff className="w-3 h-3" />
          离线
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            device.on && !isOffline ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-200">{device.name}</div>
            <div className="text-[10px] text-slate-500">
              {device.on && !isOffline ? '运行中' : isOffline ? '设备离线' : '已关闭'}
            </div>
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={isOffline}
          className={`relative w-10 h-6 rounded-full transition-colors ${
            device.on && !isOffline ? 'bg-blue-500' : 'bg-slate-600'
          } ${isOffline ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            device.on && !isOffline ? 'translate-x-4' : 'translate-x-0.5'
          }`} />
          {pulse && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse-ring" />
          )}
        </button>
      </div>

      {!isOffline && device.type === 'light' && device.brightness !== undefined && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>亮度</span>
            <span>{device.brightness}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={device.brightness}
            onChange={(e) => onBrightness?.(device.id, Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      )}

      {!isOffline && device.type === 'ac' && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400">温度</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTemperature?.(device.id, Math.max(16, (device.temperature || 24) - 1))}
                className="w-6 h-6 rounded bg-slate-700 text-slate-300 text-xs hover:bg-slate-600"
              >
                -
              </button>
              <span className="text-sm font-mono text-slate-200 w-8 text-center">
                {device.temperature}°
              </span>
              <button
                onClick={() => onTemperature?.(device.id, Math.min(30, (device.temperature || 24) + 1))}
                className="w-6 h-6 rounded bg-slate-700 text-slate-300 text-xs hover:bg-slate-600"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-1">
            {(['cool', 'heat', 'dry', 'fan'] as const).map((m) => (
              <button
                key={m}
                onClick={() => onACMode?.(device.id, m)}
                className={`flex-1 py-0.5 text-[10px] rounded transition-colors ${
                  device.acMode === m
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {modeLabel[m]}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isOffline && device.type === 'camera' && (
        <div className="mt-2 aspect-video bg-slate-900 rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Video className="w-6 h-6 text-slate-600 mx-auto mb-1" />
              <span className="text-[10px] text-slate-600">实时画面</span>
            </div>
          </div>
          {device.on && (
            <>
              <div className="absolute top-1 left-1 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] text-red-400">REC</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
            </>
          )}
        </div>
      )}

      {!isOffline && onOpenTimer && (
        <button
          onClick={() => onOpenTimer(device.id)}
          className="mt-3 w-full py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-300"
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">定时</span>
          {timerCount !== undefined && timerCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px]">
              {timerCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
