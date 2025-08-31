import { Server as Engine } from 'engine.io';
import { Server as SocketIOServer } from 'socket.io';

export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine();
  const io = new SocketIOServer();

  io.bind(engine);

  io.on('connection', (socket) => {
    // TODO: socket.io logic here
    console.log(socket.handshake.headers);
  });

  nitroApp.router.use(
    '/socket.io/',
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req as any, event.node.res);
        event._handled = true;
      },
    }),
  );
});
