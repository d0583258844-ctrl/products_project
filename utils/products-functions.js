import fs from "fs/promises";

export async function readProducts(path) {
  const data = await fs.readFile(path, "utf-8");
  return JSON.parse(data);
}

export async function writeProducts(path, data) {
  await fs.writeFile(path, JSON.stringify(data, null, 2));
}

export function getNextId(products) {
  if (!products || products.length === 0) {
    return 1;
  }
  let maxId = 0;
  products.forEach((product) => {
    if (product.id > maxId) {
      maxId = product.id;
    }
  });
  return maxId + 1;
}
