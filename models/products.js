const knex = require("knex");
const fs = require("fs/promises");
const path = require("path");

class Product {
  constructor() {
    this.db = knex(
      (this.productDbConfig = {
        client: "mysql",
        connection: {
          host: "localhost",
          port: 3306,
          user: "root",
          password: "",
          database: "products_db",
        },
      })
    );
  }

  async getAll() {
    const products = await this.db.select().from("products");
    return products;
  }

  async createRegister(body) {
    await this.db("products").insert(body);
  }

  async loadData() {
    try {
      await this.db.schema.dropTableIfExists("products");
      await this.db.schema.createTable("products", (table) => {
        table.increments("id");
        table.string("title");
        table.float("price");
        table.string("thumbnail");
      });

      const content = await fs.readFile(
        path.join(__dirname, "../data/products.json")
      );

      const products = JSON.parse(content);

      products.forEach(async (element) => {
        await this.db("products").insert(element);
      });
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new Product();
