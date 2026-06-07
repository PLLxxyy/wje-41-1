import { useState, useEffect, useCallback } from 'react';
import { Device, Room, Environment, HourlyEnergy } from '../types';
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

  const roomDevices = devices.filter((d) => d.room === currentRoom);

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
  };
}
