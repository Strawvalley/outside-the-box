import { of, fromEvent } from 'rxjs';
import { map, switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { server } from './server';
import io from 'socket.io';

// Initialise Socket.IO and wrap in observable
const io$ = of(io(server))

// Stream of connections
export const connection$ = io$
  .pipe(
    switchMap((io: any) =>
      fromEvent(io, 'connection')
        .pipe(
          map((client: any) => ({ io, client }))
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
export function listenOnConnect(event) {
  return connection$
    .pipe(
      mergeMap(({ io, client }) =>
        fromEvent(client, event)
          .pipe(
            takeUntil(
              fromEvent(client, 'disconnect')
            ),
            map((data: any) => ({ io, client, data }))
          )
      )
    )
}