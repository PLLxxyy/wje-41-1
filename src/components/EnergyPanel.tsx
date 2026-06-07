import ReactECharts from 'echarts-for-react';
import { HourlyEnergy } from '../types';

interface Props {
  hourly: HourlyEnergy[];
  deviceEnergy: { name: string; value: number }[];
}

export default function EnergyPanel({ hourly, deviceEnergy }: Props) {
  const lineOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
    },
    grid: { left: '10%', right: '4%', top: '10%', bottom: '15%' },
    xAxis: {
      type: 'category',
      data: hourly.map((h) => h.hour),
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#64748b', fontSize: 10, interval: 3 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#64748b', fontSize: 10, formatter: '{value}kWh' },
    },
    series: [
      {
        type: 'line',
        data: hourly.map((h) => h.kwh),
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#f59e0b', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245,158,11,0.3)' },
              { offset: 1, color: 'rgba(245,158,11,0)' },
            ],
          },
        },
      },
    ],
  };

  const pieOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      formatter: '{b}: {c}W ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      textStyle: { color: '#94a3b8', fontSize: 10 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        data: deviceEnergy.map((d, i) => ({
          ...d,
          itemStyle: {
            color: ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#a855f7', '#06b6d4'][i % 6],
          },
        })),
      },
    ],
  };

  const total = hourly.reduce((sum, h) => sum + h.kwh, 0);

  return (
    <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200">能耗统计</h3>
        <span className="text-xs text-slate-400">今日用电: <span className="text-amber-400 font-bold">{total.toFixed(2)}</span> kWh</span>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 h-48">
          <ReactECharts option={lineOption} style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="w-56 h-48">
          <ReactECharts option={pieOption} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
