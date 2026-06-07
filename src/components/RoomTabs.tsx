import { Room } from '../types';

const rooms: { key: Room; label: string }[] = [
  { key: 'living', label: '客厅' },
  { key: 'bedroom', label: '卧室' },
  { key: 'kitchen', label: '厨房' },
  { key: 'study', label: '书房' },
];

interface Props {
  current: Room;
  onChange: (room: Room) => void;
}

export default function RoomTabs({ current, onChange }: Props) {
  return (
    <div className="flex gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
      {rooms.map((room) => (
        <button
          key={room.key}
          onClick={() => onChange(room.key)}
          className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
            current === room.key
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200'
          }`}
        >
          {room.label}
        </button>
      ))}
    </div>
  );
}
