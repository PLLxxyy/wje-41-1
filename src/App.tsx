import { useSmartHome } from './hooks/useSmartHome';
import RoomTabs from './components/RoomTabs';
import DeviceCard from './components/DeviceCard';
import EnvironmentPanel from './components/EnvironmentPanel';
import EnergyPanel from './components/EnergyPanel';
import FeedbackToast from './components/FeedbackToast';
import TimerPanel from './components/TimerPanel';

function App() {
  const {
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
    devices,
    timers,
    deviceTimers,
    selectedTimerDevice,
    setSelectedTimerDevice,
    addTimer,
    toggleTimer,
    deleteTimer,
  } = useSmartHome(5000);

  const selectedDevice = selectedTimerDevice
    ? devices.find((d) => d.id === selectedTimerDevice)
    : undefined;

  return (
    <div className="min-h-screen bg-slate-900">
      <RoomTabs current={currentRoom} onChange={setCurrentRoom} />

      <div className="p-4 max-w-6xl mx-auto space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {roomDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onToggle={toggleDevice}
              onBrightness={setBrightness}
              onTemperature={setTemperature}
              onACMode={setACMode}
              onOpenTimer={setSelectedTimerDevice}
              timerCount={timers.filter((t) => t.deviceId === device.id).length}
            />
          ))}
        </div>

        <EnvironmentPanel env={env} />
        <EnergyPanel hourly={hourlyEnergy} deviceEnergy={deviceEnergy} />
      </div>

      <FeedbackToast message={feedback?.msg || null} />

      {selectedTimerDevice && (
        <TimerPanel
          device={selectedDevice}
          timers={deviceTimers}
          onClose={() => setSelectedTimerDevice(null)}
          onAddTimer={addTimer}
          onToggleTimer={toggleTimer}
          onDeleteTimer={deleteTimer}
        />
      )}
    </div>
  );
}

export default App;
