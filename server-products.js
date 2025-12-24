import express from "express";
import { getNextId, writeProducts, readProducts } from "./utils/products-functions.js"


const app = express();
const PORT = 3000;
const PATH = "DB/products.json";
app.use(express.json());

// תרגיל 1
app.get("/products", async (req, res) => {
  try {
    const products = await readProducts(PATH);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Unsuccses", Error: error.message });
  }
});

// תרגיל 2
app.get("/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const products = await readProducts(PATH);
  const foundProduct = products.find((product) => product.id === id);
  if (!foundProduct || foundProduct.length === 0) {
    res.status(404).json({ message: "Product by id not found" });
  }
  res.status(200).json({ message: "succses", data: foundProduct });
});

// תרגיל 3
app.post("/products", async (req, res) => {
  try {
    const products = await readProducts(PATH);
    const data = {
      id: getNextId(products),
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
    };
    products.push(data);
    await writeProducts(PATH, products);
    res.status(201).json({ message: "Added seccses", data: data });
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// תרגיל 4
// qeury params
app.put("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const products = await readProducts(PATH);
    const foundProduct = products.find((product) => product.id === id);
    if (!foundProduct || foundProduct.length === 0) {
      res.status(404).json({ message: "Product not found" });
    }
    const foundProductIndex = products.findIndex(
      (product) => product.id === id
    );
    products[foundProductIndex] = {
      ...products[foundProductIndex],
      ...req.body,
    };
    await writeProducts(PATH, products);
    res
      .status(202)
      .json({ message: "Product updated", "New content": req.body });
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

// תרגיל 5
app.delete("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const products = await readProducts(PATH);
    const filteredProducts = products.filter((product) => product.id !== id);
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ message: "Product ID does not exist." });
    }
    await writeProducts(PATH, filteredProducts);
    res.status(200).json({ message: "Product deleted seccsesfuly. " });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// תרגיל 6
app.get("/products/search", async (req, res) => {
  const category = req.query.category;
  const products = await readProducts(PATH);
  const filteredProducts = products.filter(
    (product) => product.category === category
  );
  if (!filteredProducts || filteredProducts.length === 0) {
    res.status(404).json({ message: "Product 'CATEGORY' not exist." });
  }
  res.status(201).json({ message: "Products found", data: filteredProducts });
});

// תרגיל 7
// app.get("/products/search", async (req, res) => {
//   const products = await readProducts(PATH);
//   const minPrice = parseInt(req.query.minPrice);
//   const maxPrice = parseInt(req.query.maxPrice);
//   const found_product_indexducts = products.filter(
//     (product) => product.price >= minPrice && product.price <= maxPrice
//   );
//   if (!found_product_indexducts || found_product_indexducts.length === 0) {
//     return res
//       .status(404)
//       .json({ message: "Proudcts between choiched prices not found" });
//   }
//   return res
//     .status(200)
//     .json({ message: "Products found", data: found_product_indexducts });
// });

// תרגיל 8
// app.get("/products/search/", async (req, res) => {
//   const newArr = [];
//   const wordName = req.query.name;
//   const products = await readProducts(PATH);
//   for (let i = 0; i < products.length; i++) {
//     const element = products[i];
//     const check = element.name.includes(wordName);

//     if (check) {
//       newArr.push(element);
//     }
//   }
//   if (newArr.length === 0) {
//     return res
//       .status(404)
//       .json({ message: "Products with thet name not found" });
//   }
//   console.log(newArr);
//   return res.status(200).json({ message: "Products found", data: newArr });
// });

// תרגיל 9
app.patch("/products/:id/stock", async (req, res) => {
  const id = parseInt(req.params.id);
  const stock_Dec_Inc = parseInt(req.query.stock);
  const products = await readProducts(PATH);
  const found_product_index = products.findIndex(
    (product) => product.id === id
  );
  if (!found_product_index || found_product_index.length === 0) {
    return res.status(404).json({ message: "Product ID does not exist." });
  }
  if (stock_Dec_Inc > 0) {
    products[found_product_index].stock += stock_Dec_Inc;
    await writeProducts(PATH, products);
    return res
      .status(200)
      .json({
        message: "Product stock updated: increased",
        data: products[found_product_index],
      });
  } else if (stock_Dec_Inc < 0) {
    products[found_product_index].stock += stock_Dec_Inc;
    await writeProducts(PATH, products);
    return res
      .status(200)
      .json({
        message: "Product stock updated: decreased",
        data: products[found_product_index],
      });
  }
});

// תרגיל 10
app.get("/products/low_stock", async (req, res) => {
  const low_stock = parseInt(req.query.low_stock);
  const products = await readProducts(PATH);
  const filter_products = products.filter(
    (product) => product.stock <= low_stock
  );
  if (!filter_products || filter_products.length === 0) {
    return res.status(404).json({ message: "Products not found" });
  }
  return res
    .status(200)
    .json({ message: "Product found", data: filter_products });
});

app.listen(PORT, () => {
  console.log(`Server runing on http://localhst:${PORT}`);
});

