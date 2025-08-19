// lib/sse.js
export function connectSSE(url, onMessage, onError = null) {
  const eventSource = new EventSource(url);
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      // If not JSON, pass raw data
      onMessage(event.data);
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    if (onError) {
      onError(error);
    }
  };
  
  // Return cleanup function
  return () => {
    eventSource.close();
  };
}

export function createMockLogStream(onMessage) {
  const logLevels = ['info', 'warn', 'error'];
  const messages = [
    'Instagram client initialized successfully',
    'Starting interaction with posts...',
    'Found 5 posts to interact with',
    'Liked post from @user123',
    'Left comment on post ID: 12345',
    'Rate limit reached, waiting...',
    'Resuming operations...',
    'Session saved to cookies',
    'Operation completed successfully'
  ];
  
  let index = 0;
  const interval = setInterval(() => {
    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    const message = messages[index % messages.length];
    const timestamp = new Date().toISOString();
    
    onMessage({
      timestamp,
      level,
      message,
      source: 'riona-agent'
    });
    
    index++;
  }, 2000);
  
  return () => clearInterval(interval);
}