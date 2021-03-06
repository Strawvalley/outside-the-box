import { of, fromEvent, Observable, Subject, combineLatest } from 'rxjs';
import { map, switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { server } from './server';
import io from 'socket.io';
import { logInfo } from './managers/log_manager';
import { SocketEventNames } from '../shared';

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
const sendToRoom$: Subject<{room: string; event: SocketEventNames; payload: any}> = new Subject<{room: string; event: SocketEventNames; payload: any}>();

export function sendToRoom<T>(room: string, event: SocketEventNames, payload: T): void {
  sendToRoom$.next({room, event, payload});
}

combineLatest(io$, sendToRoom$)
  .subscribe(([io, { room, event, payload }]) => {
    logInfo(`Send event ${event} to users room ${room}`);
    io.in(room).emit(event, payload);
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendToUser$: Subject<{clientId: string; event: SocketEventNames; payload: any}> = new Subject<{clientId: string; event: SocketEventNames; payload: any}>();

export function sendToUser<T>(clientId: string, event: SocketEventNames, payload: T): void {
  sendToUser$.next({clientId, event, payload});
}

combineLatest(io$, sendToUser$)
  .subscribe(([io, { clientId, event, payload }]) => {
    logInfo(`Send event ${event} to user ${clientId}`);
    io.to(clientId).emit(event, payload);
  });
