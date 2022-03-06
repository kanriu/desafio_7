const knex = require("knex");
const moment = require("moment");

class Message {
  constructor() {
    this.db = knex(
      (this.movieDbConfig = {
        client: "sqlite3",
        connection: {
          filename: "./ecommerce/messages.sqlite",
        },
        useNullAsDefault: true,
      })
    );
  }

  async getAll() {
    const messages = await this.db.select().from("messages");
    return messages;
  }

  async createRegister(body) {
    await this.db("messages").insert(body);
  }

  async init() {
    await this.db.schema.createTableIfNotExists("messages", (table) => {
      table.increments("id");
      table.string("email");
      table.datetime("date");
      table.string("message");
    });

    await this.db("messages").insert({
      email: "juan@gmail.com",
      date: moment().format("DD/MM/YYYY hh:mm:ss"),
      message: "hola a todos",
    });

    this.db.destroy();
  }
}

module.exports = new Message();
