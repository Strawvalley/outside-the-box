import { of, fromEvent, Observable } from 'rxjs';
import { map, switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { server } from './server';
import io from 'socket.io';

export interface ExtendedSocket extends io.Socket {
  username: string;
  room: string;
}

// Initialise Socket.IO and wrap in observable
const io$ = of(io(server))

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