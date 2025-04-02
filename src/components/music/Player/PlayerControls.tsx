import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faBackwardStep, faForwardStep } from '@fortawesome/free-solid-svg-icons';

interface PlayerControlsProps {
  isPlaying: boolean;
  isShuffling: boolean;
  isRepeating: boolean;
  onTogglePlay: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onNext: () => void;
  onPrevious: () => void;
  disabled?: boolean;
}

export function PlayerControls({ isPlaying, onTogglePlay, onNext, onPrevious, disabled }: PlayerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        className="text-gray-300 hover:text-purple-400 transition-all duration-300"
        onClick={onPrevious}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={faBackwardStep} className="w-5 h-5" />
      </button>
      <button
        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-purple-500 hover:scale-105 transition-all duration-300"
        onClick={onTogglePlay}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="w-5 h-5 text-white" />
      </button>
      <button
        className="text-gray-300 hover:text-purple-400 transition-all duration-300"
        onClick={onNext}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={faForwardStep} className="w-5 h-5" />
      </button>
    </div>
  );
}
