import { of, fromEvent, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import io from 'socket.io-client';

// Initialise Socket.IO and wrap in observable
const socket$ = of(io());

// Stream of connections
export const connect$ = socket$
  .pipe(
    switchMap(socket =>
      fromEvent(socket, 'connect')
        .pipe(
          map(() => socket)
        )
    )
  );

// On connection, listen for event
export function listenOnConnect(event) {
  return connect$
    .pipe(
      switchMap((socket: SocketIOClient.Socket) =>
        fromEvent(socket, event)
      )
    );
};

export function listenOnConnectWithConnection(event) {
  return connect$
    .pipe(
      switchMap((socket: SocketIOClient.Socket) =>
        combineLatest(fromEvent(socket, event), of(socket))
      )
    );
};

// On connection, emit data from observable
export function emitOnConnect<T>(observable$: Observable<any>) {
  return connect$
    .pipe(
      switchMap((socket: SocketIOClient.Socket) =>
        observable$
          .pipe(
            map((data: T) => ({ socket, data }))
          )
      )
    );
};
