(async () => {
  const express = require("express");
  const path = require("path");
  const app = express();
  const http = require("http");
  const { Server } = require("socket.io");

  const engine = require("./engine/hbs");

  const server = http.createServer(app);
  const io = new Server(server);

  const PORT = process.env.PORT || 8080;
  const Product = require("./models/products");
  const Message = require("./models/messages");
  try {
    const products = await Product.getAll();
    const messages = await Message.getAll();

    engine(app, path);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/static", express.static(path.join(__dirname, "public")));

    app.get("/", (req, res) => res.render("main"));

    io.on("connection", (socket) => {
      console.log(`an user connected: ${socket.id}`);

      socket.emit("send_products", products);

      socket.on("product", async (item) => {
        products.push(item);
        await Product.createRegister(item);
        socket.broadcast.emit("product", item);
      });

      socket.on("message", async (item) => {
        messages.push(item);
        await Message.createRegister(item);
        socket.broadcast.emit("message", item);
      });

      socket.emit("send_messages", messages);
    });
    server.listen(PORT, () =>
      console.log(`Listening on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.log(e);
    console.log("could not start servers");
  }
})();
