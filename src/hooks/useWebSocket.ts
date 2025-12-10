'use client';

import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url?: string;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = 'ws://localhost:3000/ws/dashboard',
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      // 在实际应用中，这里会创建真实的 WebSocket 连接
      // 现在我们使用模拟方式
      console.log('模拟 WebSocket 连接:', url);
      setIsConnected(true);

      if (onOpen) {
        onOpen();
      }

      // 模拟定期接收数据
      const interval = setInterval(() => {
        const message: WebSocketMessage = {
          type: 'dashboard_update',
          data: {
            timestamp: new Date().toISOString(),
            randomValue: Math.random() * 100,
          },
          timestamp: new Date().toISOString(),
        };

        setLastMessage(message);
        if (onMessage) {
          onMessage(message);
        }
      }, 5000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('WebSocket 连接错误:', error);
      if (onError) {
        onError(error as any);
      }
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    if (onClose) {
      onClose();
    }
  };

  const send = (message: any) => {
    if (isConnected && wsRef.current) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    const cleanup = connect();

    return () => {
      if (cleanup) {
        cleanup();
      }
      disconnect();
    };
  }, [url]);

  return {
    isConnected,
    lastMessage,
    send,
    connect,
    disconnect,
  };
};

export default useWebSocket;
