import { Device, Room, Environment, HourlyEnergy } from '../types';

const roomDevices: { room: Room; devices: Omit<Device, 'id' | 'room'>[] }[] = [
  {
    room: 'living',
    devices: [
      { name: '主灯', type: 'light', online: true, on: true, brightness: 80 },
      { name: '氛围灯', type: 'light', online: true, on: false, brightness: 50 },
      { name: '空调', type: 'ac', online: true, on: true, temperature: 24, acMode: 'cool', power: 1200 },
      { name: '摄像头', type: 'camera', online: true, on: true },
      { name: '窗帘', type: 'curtain', online: true, on: false },
      { name: '空气净化器', type: 'purifier', online: true, on: true, power: 45 },
    ],
  },
  {
    room: 'bedroom',
    devices: [
      { name: '床头灯', type: 'light', online: true, on: false, brightness: 30 },
      { name: '顶灯', type: 'light', online: true, on: false, brightness: 100 },
      { name: '空调', type: 'ac', online: true, on: true, temperature: 26, acMode: 'cool', power: 900 },
      { name: '摄像头', type: 'camera', online: true, on: false },
      { name: '窗帘', type: 'curtain', online: true, on: true },
    ],
  },
  {
    room: 'kitchen',
    devices: [
      { name: '顶灯', type: 'light', online: true, on: true, brightness: 100 },
      { name: '净水器', type: 'purifier', online: true, on: true, power: 30 },
      { name: '音箱', type: 'speaker', online: false, on: false },
    ],
  },
  {
    room: 'study',
    devices: [
      { name: '台灯', type: 'light', online: true, on: true, brightness: 90 },
      { name: '顶灯', type: 'light', online: true, on: false, brightness: 100 },
      { name: '空调', type: 'ac', online: true, on: false, temperature: 25, acMode: 'cool', power: 800 },
      { name: '摄像头', type: 'camera', online: true, on: false },
      { name: '音箱', type: 'speaker', online: true, on: true },
    ],
  },
];

export function generateDevices(): Device[] {
  const devices: Device[] = [];
  let id = 1;
  roomDevices.forEach((group) => {
    group.devices.forEach((d) => {
      devices.push({ ...d, id: `dev-${id++}`, room: group.room });
    });
  });
  return devices;
}

export function generateEnvironment(): Environment {
  return {
    temperature: 22 + Math.random() * 6,
    humidity: 40 + Math.random() * 30,
    aqi: Math.floor(20 + Math.random() * 100),
  };
}

export function generateHourlyEnergy(): HourlyEnergy[] {
  const data: HourlyEnergy[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = `${String(i).padStart(2, '0')}:00`;
    const base = i >= 7 && i <= 22 ? 0.5 + Math.random() * 1.5 : 0.1 + Math.random() * 0.3;
    data.push({ hour, kwh: Math.round(base * 100) / 100 });
  }
  return data;
}

export function generateDeviceEnergy(devices: Device[]): { name: string; value: number }[] {
  return devices
    .filter((d) => d.online && d.on && d.power)
    .map((d) => ({
      name: d.name,
      value: Math.round((d.power || 0) * (0.8 + Math.random() * 0.4)),
    }));
}
