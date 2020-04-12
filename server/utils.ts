import { User } from "./models/user";
import { ExtendedSocket } from "./connection";

// Deprecated: games save all users instead
// export function getAllUsersInRoom(io, room: string): User[] {
//   const allSockets = io.sockets.sockets;
//   return Object.entries(allSockets)
//     .map(([id, socket]: [string, ExtendedSocket]) => ({
//       id,
//       username: socket.username,
//       room: socket.room,
//       isAdmin: games[socket.room] ? id === games[socket.room].admin : false
//     }))
//     .filter(user => user.room === room);
// }