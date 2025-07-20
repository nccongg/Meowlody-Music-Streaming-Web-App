import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeLow, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  // Sử dụng state nội bộ để theo dõi giá trị hiện tại
  const [localVolume, setLocalVolume] = useState(volume);
  
  // Cập nhật state nội bộ khi prop thay đổi
  useEffect(() => {
    setLocalVolume(volume);
    console.log(`VolumeControl received: ${volume}%`);
  }, [volume]);

  const getVolumeIcon = () => {
    if (localVolume === 0) return faVolumeMute;
    if (localVolume < 50) return faVolumeLow;
    return faVolumeHigh;
  };

  const handleVolumeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setLocalVolume(newVolume);
    onVolumeChange(newVolume);
    console.log(`Volume slider moved to: ${newVolume}%`);
  };

  const handleMuteToggle = () => {
    const newVolume = localVolume === 0 ? 100 : 0;
    setLocalVolume(newVolume);
    onVolumeChange(newVolume);
    console.log(`Mute toggle clicked, volume set to: ${newVolume}%`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="text-gray-300 hover:text-purple-400 transition-all duration-300"
        onClick={handleMuteToggle}
      >
        <FontAwesomeIcon icon={getVolumeIcon()} className="w-5 h-5" />
      </button>
      <div className="flex-1 relative h-1 bg-gray-700 rounded-full">
        {/* Phần đã điều chỉnh */}
        <div 
          className="absolute h-full bg-purple-500 rounded-full"
          style={{ width: `${localVolume}%` }}
        ></div>
        
        {/* Thanh input range */}
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={localVolume}
          onChange={handleVolumeInputChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {/* Thumb indicator */}
        <div 
          className="absolute top-1/2 w-3 h-3 bg-white rounded-full -translate-y-1/2 pointer-events-none"
          style={{ 
            left: `${localVolume}%`, 
            transform: `translateX(-50%) translateY(-50%)` 
          }}
        ></div>
      </div>
    </div>
  );
}
