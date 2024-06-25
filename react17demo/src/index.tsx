import React from "react";
import ReactDOM from "react-dom";

import { faker } from "@faker-js/faker";

type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
};

const generateProduct = () => {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    image: faker.image.url(),
  };
};

const generateProducts = (numProducts: number) => {
  const products: Product[] = [];
  for (let i = 0; i < numProducts; i++) {
    products.push(generateProduct());
  }

  return products;
};

const App: React.FC = () => {
  const numProduct = 5;
  const products = generateProducts(numProduct);

  return (
    <>
      {products.map((product) => (
        <div key={product.id}>
          {" "}
          <img src={product.image} alt={product.name} /> <h2>{product.name}</h2>{" "}
          <p>{product.price}</p> <p>{product.description}</p>{" "}
          <p>{product.category}</p>{" "}
        </div>
      ))}
      <div>React 17 Demo!!</div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("react-17-demo"));
