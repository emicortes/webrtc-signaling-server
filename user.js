import { uuid } from "uuidv4";
import { Socket } from "socket.io";
import { Universe } from "./universe.js";
import { omit } from "lodash-es";

export class User {
  admin = false;

  /**
   *
   * @param {Socket} socket
   * @param {Universe} universe
   */
  constructor(socket, universe) {
    this.socket = socket;
    this.id = uuid();
    this.status = "Online";

    socket.on("login", (data) => {
      this.name = data;
      universe.notifyUserList();
    });

    socket.on("sendMessage", (msg) => {
      const target = universe.getUser(msg.target);
      target?.notifyMessage(
        omit({ from: { id: this.id, name: this.name }, ...msg }, "target")
      );
    });

    socket.on("status", (data) => {
      this.status = data;
      universe.notifyUserList();
    });
  }

  notifyMessage(msg) {
    this.socket.emit("message", msg);
  }
}
