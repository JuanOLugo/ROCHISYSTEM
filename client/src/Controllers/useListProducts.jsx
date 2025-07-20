import axios from "axios";
import React, { useState } from "react";
import { DisminuirProduct } from "./Product.controller";

function useListProducts() {
  const [NumDisminuir, setNumDisminuir] = useState(0);
  const [Product, setProduct] = useState({});
  const [DialogState, setDialogState] = useState(false);
  const [IdEditing, setIdEditing] = useState("");
  const [isEditing, setisEditing] = useState(false);
  const [products, setProducts] = useState([]);
  const OnChangeDisminuir = (number, product) => {
    setNumDisminuir((prev) => {
      const newValue = prev + number;

      if (newValue < 0 || newValue > product.stock) {
        return prev;
      }
      if (newValue > 0) {
        setIdEditing(product.code);
        setisEditing(true);
        setProduct(product);
      } else {
        setIdEditing("");
        setisEditing(false);
        setProduct({});
      }
      return newValue;
    });
  };

  const onSaveData = (product) => {
    setProduct(product);
  };

  const onChangeDialogState = (state) => {
    setDialogState(state);
  };

  const onConfirmDialog = async () => {
    console.log("Confirmado", Product, NumDisminuir);

    const dataToSend = {
      _id: Product._id,
      num: NumDisminuir,
    };

    try {
      await DisminuirProduct(dataToSend);

      setProducts((prev) => {
        const indexProduct = prev.findIndex((p) => Product._id === p._id);
        if (indexProduct === -1) {
          throw new Error("No se encontró el producto");
        }

        // Creamos una copia del array y del objeto modificado
        const updatedProducts = [...prev];
        const updatedProduct = {
          ...updatedProducts[indexProduct],
          stock: updatedProducts[indexProduct].stock - NumDisminuir,
        };

        updatedProducts[indexProduct] = updatedProduct;

        return updatedProducts;
      });

      // Reset de los estados relacionados con la edición
      onChangeDialogState(false);
      setIdEditing("");
      setNumDisminuir(0);
      setProduct({});
      setisEditing(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo disminuir el producto");
    }
  };

  const onCancelDialog = () => {
    onChangeDialogState(false);
    setIdEditing("");
    setNumDisminuir(0);
    setProduct({});
    setisEditing(false);
  };

  return {
    OnChangeDisminuir,
    NumDisminuir,
    onSaveData,
    onChangeDialogState,
    IdEditing,
    isEditing,
    DialogState,
    onConfirmDialog,
    onCancelDialog,
    products,
    setProducts,
  };
}

export default useListProducts;
