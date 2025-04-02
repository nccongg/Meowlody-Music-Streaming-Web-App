import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeLow, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const getVolumeIcon = () => {
    if (volume === 0) return faVolumeMute;
    if (volume < 0.5) return faVolumeLow;
    return faVolumeHigh;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="text-gray-300 hover:text-purple-400 transition-all duration-300"
        onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
      >
        <FontAwesomeIcon icon={getVolumeIcon()} className="w-5 h-5" />
      </button>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:hover:bg-purple-400 [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:duration-300"
          style={{
            background: `linear-gradient(to right, #A855F7 0%, #A855F7 ${volume * 100}%, rgba(255, 255, 255, 0.1) ${
              volume * 100
            }%, rgba(255, 255, 255, 0.1) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
