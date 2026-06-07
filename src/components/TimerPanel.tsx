import { useState } from 'react';
import { Timer, TimerAction } from '../types';
import { Clock, Plus, Trash2, X, Lightbulb, Thermometer, Video, Blinds, Wind, Speaker } from 'lucide-react';
import { Device } from '../types';

const typeIcon: Record<Device['type'], React.ElementType> = {
  light: Lightbulb,
  ac: Thermometer,
  camera: Video,
  curtain: Blinds,
  purifier: Wind,
  speaker: Speaker,
};

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

interface Props {
  device: Device | undefined;
  timers: Timer[];
  onClose: () => void;
  onAddTimer: (timer: Omit<Timer, 'id'>) => void;
  onToggleTimer: (id: string) => void;
  onDeleteTimer: (id: string) => void;
}

export default function TimerPanel({ device, timers, onClose, onAddTimer, onToggleTimer, onDeleteTimer }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTime, setNewTime] = useState('08:00');
  const [newAction, setNewAction] = useState<TimerAction>('on');
  const [newDays, setNewDays] = useState<number[]>([]);

  if (!device) return null;

  const Icon = typeIcon[device.type];

  const handleDayToggle = (day: number) => {
    setNewDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddTimer = () => {
    onAddTimer({
      deviceId: device.id,
      deviceName: device.name,
      time: newTime,
      action: newAction,
      enabled: true,
      days: [...newDays].sort(),
    });
    setShowAddForm(false);
    setNewDays([]);
  };

  const formatDays = (days: number[]) => {
    if (days.length === 0) return '仅一次';
    if (days.length === 7) return '每天';
    if (days.length === 5 && days.every((d) => d >= 1 && d <= 5)) return '工作日';
    return days.map((d) => `周${weekDays[d]}`).join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              device.on ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">{device.name}</div>
              <div className="text-[10px] text-slate-500">定时设置</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {timers.length === 0 && !showAddForm && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <div className="text-sm text-slate-500">暂无定时任务</div>
              <div className="text-xs text-slate-600 mt-1">点击下方按钮添加定时</div>
            </div>
          )}

          {timers.map((timer) => (
            <div
              key={timer.id}
              className={`p-3 rounded-lg border transition-all ${
                timer.enabled
                  ? 'bg-slate-700/50 border-slate-600'
                  : 'bg-slate-800/50 border-slate-700 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${
                    timer.enabled ? 'text-blue-400' : 'text-slate-500'
                  }`} />
                  <span className={`text-lg font-mono ${
                    timer.enabled ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {timer.time}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    timer.action === 'on'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {timer.action === 'on' ? '开启' : '关闭'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleTimer(timer.id)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      timer.enabled ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      timer.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <button
                    onClick={() => onDeleteTimer(timer.id)}
                    className="w-7 h-7 rounded bg-slate-700 hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                {formatDays(timer.days)}
              </div>
            </div>
          ))}

          {showAddForm && (
            <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600 space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">时间</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">动作</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewAction('on')}
                    className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                      newAction === 'on'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    开启
                  </button>
                  <button
                    onClick={() => setNewAction('off')}
                    className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                      newAction === 'off'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    关闭
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">重复</label>
                <div className="flex gap-1">
                  {weekDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => handleDayToggle(index)}
                      className={`flex-1 aspect-square rounded-lg text-xs transition-colors ${
                        newDays.includes(index)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-600 hover:bg-slate-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {newDays.length === 0 ? '不选择则仅执行一次' : formatDays(newDays)}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-400 text-sm hover:bg-slate-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddTimer}
                  className="flex-1 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700">
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加定时
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
