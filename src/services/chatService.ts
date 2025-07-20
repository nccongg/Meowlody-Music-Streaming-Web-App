interface ChatResponse {
  response: string;
  actions: ChatAction[];
}

interface ChatAction {
  type: string;
  data: Record<string, unknown>;
}

interface ChatHistoryItem {
  message: string;
  response: string;
  timestamp: string;
}

const API_URL = 'http://localhost:5000/api';

/**
 * Send a message to the chat API
 */
export const sendMessage = async (message: string, sessionId: string = 'default'): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        sessionId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};

/**
 * Get chat history from the API
 */
export const getChatHistory = async (sessionId: string = 'default'): Promise<ChatHistoryItem[]> => {
  try {
    const response = await fetch(`${API_URL}/chat/history?sessionId=${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get chat history');
    }
    
    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    return [];
  }
};

/**
 * Reset the chat history
 */
export const resetChat = async (sessionId: string = 'default'): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/chat/reset?sessionId=${sessionId}`, {
      method: 'DELETE'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error in resetChat:', error);
    return false;
  }
}; 