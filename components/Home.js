import React from "react";
import styles from "../styles/Home.module.css";
import ProductDataGrid from "./DataGrid";

function Home() {
  return (
    <div>
      <h1>Liste des Produits : </h1>
      <ProductDataGrid />
    </div>
  );
}

export default Home;
