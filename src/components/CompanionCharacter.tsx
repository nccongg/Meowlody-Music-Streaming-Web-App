import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faComment, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { useChat } from '../hooks/useChat';

interface ChatAction {
  type: string;
  data: Record<string, unknown>;
}

export function CompanionCharacter() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const { playSong, createPlaylist } = useMusicPlayer();
  const { messages, isLoading, sendMessage, resetChat } = useChat();

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCharacterClick = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1000);
  };

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const message = inputMessage;
    setInputMessage('');
    
    try {
      const response = await sendMessage(message);
      
      // Process any actions returned from the API
      if (response && response.actions && response.actions.length > 0) {
        handleChatActions(response.actions);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleChatActions = (actions: ChatAction[]) => {
    actions.forEach(action => {
      switch (action.type) {
        case 'PLAY_SONG':
          if (typeof action.data.songId === 'string' && typeof action.data.title === 'string') {
            playSong(action.data.songId, action.data.title);
          }
          break;
        case 'CREATE_PLAYLIST':
          if (typeof action.data.name === 'string' && Array.isArray(action.data.songs)) {
            createPlaylist(action.data.name, action.data.songs);
          }
          break;
        default:
          console.log('Unknown action type:', action.type);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end">
      {/* Chat bubble */}
      {isExpanded && (
        <div className="mb-4 mr-4 p-4 bg-black/80 backdrop-blur-xl rounded-2xl shadow-lg w-[350px] h-[500px] animate-fade-in flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCat} className="text-[var(--color-brand-primary)] mr-2" />
              <h3 className="text-white font-bold">Chat với Meowlody</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={resetChat}
                className="text-white/60 hover:text-white transition-colors text-xs"
              >
                Xóa chat
              </button>
              <button 
                onClick={toggleChat} 
                className="text-white/60 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div 
            ref={chatRef}
            className="flex-1 overflow-y-auto bg-white/5 rounded-xl p-3 mb-4 space-y-3 custom-scrollbar"
          >
            {messages.length === 0 ? (
              <p className="text-white/60 text-center mt-[45%] text-sm">
                Chào bạn! Tôi là Meowlody, bạn có thể hỏi tôi về âm nhạc, hoặc yêu cầu phát bài hát yêu thích!
              </p>
            ) : (
              messages.map(message => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-xl ${
                      message.sender === 'user' 
                        ? 'bg-[var(--color-brand-primary)] text-white rounded-tr-none' 
                        : 'bg-white/10 text-white rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white p-3 rounded-xl rounded-tl-none max-w-[80%]">
                  <p className="text-sm">Đang nhập...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat input */}
          <div className="flex items-center bg-white/10 rounded-xl overflow-hidden">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 resize-none h-12 max-h-20"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="text-white p-3 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}

      {/* Character and chat button */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleChat}
          className={`bg-[var(--color-brand-primary)] p-3 rounded-full shadow-lg hover:bg-[var(--color-brand-primary-dark)] transition-transform ${
            isExpanded ? 'scale-0' : 'scale-100'
          }`}
        >
          <FontAwesomeIcon icon={faComment} className="text-white w-5 h-5" />
        </button>

        <button
          onClick={handleCharacterClick}
          className={`bg-[var(--color-brand-primary)] p-4 rounded-full shadow-lg hover:bg-[var(--color-brand-primary-dark)] transition-all ${
            isWaving ? 'animate-bounce' : ''
          }`}
        >
          <FontAwesomeIcon icon={faCat} className="text-white w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
