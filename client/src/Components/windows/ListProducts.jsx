import { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Input, Button } from "@nextui-org/react";
import { FaTrashAlt } from "react-icons/fa";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import { DeleteProductAPI, GetProductAPI } from "../../Controllers/Product.controller";
import { RiPencilFill } from "react-icons/ri";

export default function ListProduct() {
  const [products, setProducts] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const data = new Promise((res, rej) => {
      const data = GetProductAPI();
      data ? res(data) : rej({ message: "Error" });
    });
    data.then((data) => setProducts(data.data));
  }, []);

  const handleDelete = useCallback(async (id) => {
    DeleteProductAPI({id})
    setProducts((products) => products.filter((product) => product._id !== id));
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesName = product.code
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesMinPrice =
        minPrice === "" || product.priceSell >= parseFloat(minPrice);
      const matchesMaxPrice =
        maxPrice === "" || product.priceSell <= parseFloat(maxPrice);
      return matchesName && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.priceSell - b.priceSell;
      } else {
        return b.priceSell - a.priceSell;
      }
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-wrap gap-4">
        <Input
          clearable
          label="Filtrar por codigo"
          placeholder="Filtrar por codigo"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="max-w-xs"
        />
        <Input
          clearable
          type="number"
          label="Precio mínimo"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="max-w-xs"
        />
        <Input
          clearable
          type="number"
          label="Precio máximo"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <Table
        aria-label="Tabla de productos"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
      >
        <TableHeader>
          <TableColumn>Código</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn
            onClick={toggleSortOrder}
            className="cursor-pointer flex items-center "
          >
            <h1 className="flex">Precio Costo{" "} <label htmlFor="">{sortOrder === "asc" ? (
              <FaLongArrowAltDown className="mx-1 " />
            ) : (
              <FaLongArrowAltUp className="mx-1 " />
            )}</label></h1>
          </TableColumn>
          <TableColumn
            onClick={toggleSortOrder}
            className="cursor-pointer "
          >
            <h1 className="flex">Precio Venta{" "} <label htmlFor="">{sortOrder === "asc" ? (
              <FaLongArrowAltDown className="mx-1 " />
            ) : (
              <FaLongArrowAltUp className="mx-1 " />
            )}</label></h1>
            
          </TableColumn>
          <TableColumn>Proveedor</TableColumn>
          <TableColumn>Stock</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.code}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.priceCost.toLocaleString("es-co")}</TableCell>
              <TableCell>${product.priceSell.toLocaleString("es-co")}</TableCell>
              <TableCell>{product.supplier}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Button
                  color="error"
                  auto
                  onClick={() => handleDelete(product._id)}
                >
                  <div className="bg-red-500 p-2 rounded-xl">
                    <FaTrashAlt className="text-xl text-white" />
                  </div>
                </Button>
                <Button
                  color="error"
                  auto
                  onClick={() => handleDelete(product._id)}
                >
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
