import { games } from "./game";
import { User } from "./user";
import { ExtendedSocket } from "./connection";

export function getAllUsersInRoom(io, roomName: string): User[] {
  const allSockets = io.sockets.sockets;
  return Object.entries(allSockets)
    .map(([id, socket]: [string, ExtendedSocket]) => ({
      id,
      username: socket.username,
      room: socket.room,
      isAdmin: games[socket.room] ? id === games[socket.room].admin : false
    }))
    .filter(({ room }) => room === roomName);
}