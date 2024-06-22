import faker from "faker";
// import React from "react";
// import ReactDOM from "react-dom";

let products = "";

for (let i = 0; i < 10; i++) {
  const name = faker.commerce.productName() + "\n";
  products += `<div>${name}</div>`;
}

console.log(products);

document.querySelector("#dev-products").innerHTML = products;
// interface Product {
//     name: string;
// }

// const App: React.FC = () => {
//     const products: Product[] = [];

//     for (let i = 0; i < 10; i++) {
//         const name = faker.commerce.productName();
//         products.push({ name });
//     }

//     return (
//         <div>
//             {products.map((product, index) => (
//                 <div key={index}>{product.name}</div>
//             ))}
//         </div>
//     );
// };

// ReactDOM.render(<App />, document.getElementById("root"));
