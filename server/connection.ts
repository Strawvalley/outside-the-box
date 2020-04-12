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

const sendToRoom$: Subject<{room: string; event: SocketEventNames; payload: any}> = new Subject<{room: string; event: SocketEventNames; payload: any}>();

export function sendToRoom<T>(room: string, event: SocketEventNames, payload: T): void {
  sendToRoom$.next({room, event, payload});
}

combineLatest(io$, sendToRoom$)
  .subscribe(([io, { room, event, payload }]) => {
    logInfo(`Send event ${event} to room ${room}`);
    io.in(room).emit(event, payload);
  });
