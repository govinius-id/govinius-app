import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

let socket: Socket | null = null;

const runtimeConfig = useRuntimeConfig();

export const $socketIo = () => {
  if (!socket) {
    socket = io(runtimeConfig.public.socket_io_url, {
      autoConnect: true,
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  return socket;
};
