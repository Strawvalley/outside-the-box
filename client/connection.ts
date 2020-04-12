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
export function listenOnConnect<T>(event): Observable<T> {
  return connect$
    .pipe(
      switchMap((socket: SocketIOClient.Socket) =>
        fromEvent<T>(socket, event)
      )
    );
}

export function listenOnConnectWithConnection<T>(event: string): Observable<[T, SocketIOClient.Socket]> {
  return connect$
    .pipe(
      switchMap((socket: SocketIOClient.Socket) =>
        combineLatest(fromEvent<T>(socket, event), of(socket))
      )
    );
}

// On connection, emit data from observable
export function emitOnConnect<T>(observable$: Observable<T>): Observable<{ socket: SocketIOClient.Socket; data: T }> {
  return connect$
    .pipe(
      switchMap((socket: SocketIOClient.Socket) =>
        observable$
          .pipe(
            map((data: T) => ({ socket, data }))
          )
      )
    );
}
