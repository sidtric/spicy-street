import { io } from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
export const socket = io(API, { autoConnect: true });
