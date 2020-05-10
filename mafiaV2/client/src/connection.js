import io from 'socket.io-client';
const socket = io('http://localhost:9000', {transports: ['websocket'], upgrade: false, 'force new connection' : true, reconnection : true});

export default socket;