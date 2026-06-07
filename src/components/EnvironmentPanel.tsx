import ReactECharts from 'echarts-for-react';
import { Environment } from '../types';

interface Props {
  env: Environment;
}

function Gauge({ title, value, min, max, unit, color }: {
  title: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  color: string;
}) {
  const option = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min,
        max,
        splitNumber: 5,
        itemStyle: { color },
        progress: { show: true, width: 10 },
        pointer: { show: false },
        axisLine: { lineStyle: { width: 10, color: [[1, '#1e293b']] } },
        axisTick: { show: false },
        splitLine: { length: 6, lineStyle: { width: 1, color: '#334155' } },
        axisLabel: { distance: 12, color: '#64748b', fontSize: 9 },
        detail: {
          valueAnimation: true,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#e2e8f0',
          offsetCenter: [0, '30%'],
          formatter: `{value}${unit}`,
        },
        data: [{ value: Math.round(value * 10) / 10 }],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-36 h-28">
        <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
      </div>
      <span className="text-xs text-slate-400 -mt-2">{title}</span>
    </div>
  );
}

export default function EnvironmentPanel({ env }: Props) {
  return (
    <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-200 mb-3">环境总览</h3>
      <div className="flex justify-around">
        <Gauge title="温度" value={env.temperature} min={10} max={40} unit="°C" color="#f59e0b" />
        <Gauge title="湿度" value={env.humidity} min={0} max={100} unit="%" color="#3b82f6" />
        <Gauge title="空气质量" value={env.aqi} min={0} max={200} unit="" color="#22c55e" />
      </div>
    </div>
  );
}
