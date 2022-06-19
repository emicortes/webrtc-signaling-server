import { remove } from "lodash-es";
import { User } from "./user.js";
import { Server } from "socket.io";

export class Universe {
  /**
   * Users in the universe
   * @type {User[]}
   */
  users = [];

  /**
   * @type {User}
   */
  adminUser = null;

  /**
   * Creates an universe
   * @param {Server} io
   */
  constructor(io) {
    this.io = io;

    this.io.on("connection", (socket) => {
      const user = this.addUser(socket);
      if (socket.handshake.headers.authorization === "superadmin") {
        this.adminUser = user;
        user.admin = true;
      }
    });
  }

  /**
   * Sends the user collections to all the users
   */
  notifyUserList() {
    this.users.forEach((user) =>
      user.socket.emit(
        "users",
        this.users.filter(x=>x.name && x.id !== user.id).map((user) => ({
          id: user.id,
          admin: user.admin,
          name: user.name,
          status: user.status
        }))
      )
    );
  }

  /**
   * Removes the user of the universe
   * @param {User} user
   */
  removeUser(user) {
    remove(this.users, (usr) => usr.id === user.id);
    this.notifyUserList();
  }

  /**
   * Add an user to the universe
   * @param {Socket} socket connection
   * @returns {User}
   */
  addUser(socket) {
    const user = new User(socket, this);
    this.users.push(user);
    user.socket.on("disconnect", () => this.removeUser(user));
    this.notifyUserList();
    return user;
  }

  /**
   * 
   * @param {string} id 
   * @returns 
   */
  getUser(id) {
      return this.users.find(usr => usr.id == id);
  }
}
