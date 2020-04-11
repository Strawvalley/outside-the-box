import { games } from "./game";
import { User } from "./user";

export function getAllUsersInRoom(io, roomName: string): User[] {
  const allSockets = io.sockets.sockets;
  return Object.entries(allSockets)
    .map(([id, socket]: [any, any]) => ({
      id,
      username: socket.username,
      room: socket.room,
      isAdmin: games[socket.room] ? id === games[socket.room].admin : false
    }))
    .filter(({ room }) => room === roomName);
}