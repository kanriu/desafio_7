(async () => {
  const Message = require("../models/messages");
  const Product = require("../models/products");

  await Product.loadData();
  await Message.init();

  console.log("Tablas y registros generados exitosamente");

  return;
})();
