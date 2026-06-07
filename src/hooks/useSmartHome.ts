import { useState, useEffect, useCallback, useRef } from 'react';
import { Device, Room, Environment, HourlyEnergy, Timer, TimerAction } from '../types';
import {
  generateDevices,
  generateEnvironment,
  generateHourlyEnergy,
  generateDeviceEnergy,
} from '../utils/mockData';

export function useSmartHome(refreshInterval = 5000) {
  const [devices, setDevices] = useState<Device[]>(() => generateDevices());
  const [currentRoom, setCurrentRoom] = useState<Room>('living');
  const [env, setEnv] = useState<Environment>(() => generateEnvironment());
  const [hourlyEnergy, setHourlyEnergy] = useState<HourlyEnergy[]>(() => generateHourlyEnergy());
  const [deviceEnergy, setDeviceEnergy] = useState<{ name: string; value: number }[]>([]);
  const [feedback, setFeedback] = useState<{ id: string; msg: string } | null>(null);
  const [timers, setTimers] = useState<Timer[]>([]);
  const [selectedTimerDevice, setSelectedTimerDevice] = useState<string | null>(null);
  const executedTimersRef = useRef<Set<string>>(new Set());

  const roomDevices = devices.filter((d) => d.room === currentRoom);
  const deviceTimers = selectedTimerDevice
    ? timers.filter((t) => t.deviceId === selectedTimerDevice)
    : [];

  useEffect(() => {
    setDeviceEnergy(generateDeviceEnergy(devices));
  }, [devices]);

  const toggleDevice = useCallback((id: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const updated = { ...d, on: !d.on };
        setFeedback({ id, msg: `${updated.name} 已${updated.on ? '开启' : '关闭'}` });
        setTimeout(() => setFeedback((f) => (f?.id === id ? null : f)), 1500);
        return updated;
      })
    );
  }, []);

  const setBrightness = useCallback((id: string, val: number) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, brightness: val } : d)));
  }, []);

  const setTemperature = useCallback((id: string, val: number) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, temperature: val } : d)));
  }, []);

  const setACMode = useCallback((id: string, mode: Device['acMode']) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, acMode: mode } : d)));
  }, []);

  const addTimer = useCallback((timer: Omit<Timer, 'id'>) => {
    const id = `timer-${Date.now()}`;
    setTimers((prev) => [...prev, { ...timer, id }]);
    setFeedback({ id, msg: `已添加 ${timer.deviceName} 定时${timer.action === 'on' ? '开启' : '关闭'}` });
    setTimeout(() => setFeedback((f) => (f?.id === id ? null : f)), 1500);
  }, []);

  const updateTimer = useCallback((id: string, updates: Partial<Timer>) => {
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
    executedTimersRef.current.delete(id);
  }, []);

  const toggleTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, enabled: !t.enabled };
        if (!updated.enabled) {
          executedTimersRef.current.delete(id);
        }
        return updated;
      })
    );
  }, []);

  const checkAndExecuteTimers = useCallback(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentDay = now.getDay();

    setTimers((prev) => {
      prev.forEach((timer) => {
        if (!timer.enabled) return;
        if (timer.time !== currentTime) return;
        if (timer.days.length > 0 && !timer.days.includes(currentDay)) return;

        const execKey = `${timer.id}-${now.toDateString()}-${currentTime}`;
        if (executedTimersRef.current.has(execKey)) return;

        executedTimersRef.current.add(execKey);

        const device = devices.find((d) => d.id === timer.deviceId);
        if (!device || !device.online) return;

        const shouldToggle =
          (timer.action === 'on' && !device.on) || (timer.action === 'off' && device.on);

        if (shouldToggle) {
          setDevices((prevDevices) =>
            prevDevices.map((d) => {
              if (d.id !== timer.deviceId) return d;
              const updated = { ...d, on: timer.action === 'on' };
              setFeedback({
                id: timer.id,
                msg: `定时${timer.action === 'on' ? '开启' : '关闭'} ${timer.deviceName}`,
              });
              setTimeout(() => setFeedback((f) => (f?.id === timer.id ? null : f)), 1500);
              return updated;
            })
          );
        }
      });
      return prev;
    });
  }, [devices]);

  const refresh = useCallback(() => {
    setEnv(generateEnvironment());
    setHourlyEnergy(generateHourlyEnergy());
    setDeviceEnergy(generateDeviceEnergy(devices));
    // Randomly toggle one device offline/online
    if (Math.random() < 0.1) {
      setDevices((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        return prev.map((d, i) => (i === idx ? { ...d, online: !d.online } : d));
      });
    }
  }, [devices]);

  useEffect(() => {
    const timer = setInterval(refresh, refreshInterval);
    return () => clearInterval(timer);
  }, [refresh, refreshInterval]);

  useEffect(() => {
    const timer = setInterval(checkAndExecuteTimers, 10000);
    checkAndExecuteTimers();
    return () => clearInterval(timer);
  }, [checkAndExecuteTimers]);

  return {
    devices,
    roomDevices,
    currentRoom,
    setCurrentRoom,
    env,
    hourlyEnergy,
    deviceEnergy,
    toggleDevice,
    setBrightness,
    setTemperature,
    setACMode,
    feedback,
    timers,
    deviceTimers,
    selectedTimerDevice,
    setSelectedTimerDevice,
    addTimer,
    updateTimer,
    deleteTimer,
    toggleTimer,
  };
}
