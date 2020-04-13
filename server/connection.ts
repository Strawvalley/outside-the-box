import { of, fromEvent, Observable, Subject, combineLatest } from 'rxjs';
import { map, switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { server } from './server';
import io from 'socket.io';
import { SocketEventNames } from 'shared/enums/socket_event_names';
import { logInfo } from './managers/log_manager';

export interface ExtendedSocket extends io.Socket {
  username: string;
  room: string;
}

// Initialise Socket.IO and wrap in observable
export const io$ = of(io(server))

// Stream of connections
export const connection$ = io$
  .pipe(
    switchMap((io: io.Server) =>
      fromEvent(io as any, 'connection')
        .pipe(
          map((client: ExtendedSocket) => ({ io, client }))
        )
    )
  )

// Stream of disconnections
export const disconnect$ = connection$
  .pipe(
    mergeMap(({ io, client }) =>
      fromEvent(client, 'disconnect')
        .pipe(
          map(() => ({ io, client }))
        )
    )
  )

// On connection, listen for event
export function listenOnConnect<T>(event): Observable<{io: io.Server; client: ExtendedSocket; data: T}> {
  return connection$
    .pipe(
      mergeMap(({ io, client }) =>
        fromEvent(client, event)
          .pipe(
            takeUntil(
              fromEvent(client, 'disconnect')
            ),
            map((data: T) => ({ io, client, data }))
          )
      )
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendToRoomWithUserCallback$: Subject<{room: string; event: SocketEventNames; callback: (socketId: string) => any}> = new Subject<{room: string; event: SocketEventNames; callback: (socketId: string) => any}>();

export function sendToRoomWithUserCallback<T>(room: string, event: SocketEventNames, callback: (socketId: string) => T): void {
  sendToRoomWithUserCallback$.next({room, event, callback});
}

combineLatest(io$, sendToRoomWithUserCallback$)
  .subscribe(([io, { room, event, callback }]) => {
    logInfo(`Send event ${event} to room ${room}`);
    Object.entries(io.in(room).sockets)
      .forEach(([id, socket]) => {
        socket.emit(event, callback(id));
      });
  });
