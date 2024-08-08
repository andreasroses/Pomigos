import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const socket = io(URL);