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
import {
  DeleteProductAPI,
  GetProductAPI,
} from "../../Controllers/Product.controller";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

export default function ListProduct() {
  const [products, setProducts] = useState([]);
  const [codeFilter, setcodeFilter] = useState("");
  const [nameFilter, setnameFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [productspaginate, setproductspaginate] = useState([]);
  const [pageNum, setpageNum] = useState(1);
  const [pageSize, setpageSize] = useState(10);

  useEffect(() => {
    const data = new Promise(res => res(GetProductAPI()));
    toast.promise(
      data,
      {
        pending: "Obteniendo los productos...",
        success: "Productos obtenidos 👌",
        error: "Error al obtener los productos 🤯",
      },
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );
    data
      .then((data) => setProducts(data.data))
      .catch((err) =>
        console.log("Recuerda que: " + err.response.data.message)
      );
  }, []);

  const handleDelete = useCallback(async (id) => {
    DeleteProductAPI({ id });
    setProducts((products) => products.filter((product) => product._id !== id));
    setproductspaginate((products) =>
      products.filter((product) => product._id !== id)
    );
  }, []);

  useEffect(() => {
    if (codeFilter.length > 0 || nameFilter.length > 0) {
      setproductspaginate(
        products.filter((product) => {
          const matchesName = product.code
            .toLowerCase()
            .includes(codeFilter.toLowerCase());
          const matchesnameFilter = product.name
            .toLowerCase()
            .includes(nameFilter.toLowerCase());
          return matchesName && matchesnameFilter;
        })
      );
    } else {
      setproductspaginate(paginacion(products, 10, pageNum));
    }
  }, [codeFilter, nameFilter]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  //paginacion

  const paginacion = (array, page_size, page_number) => {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  };

  useEffect(() => {
    setproductspaginate(paginacion(products, pageSize, pageNum));
  }, [products, pageNum, pageSize]);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer containerId={11} />
      <div className="mb-4 flex flex-wrap gap-4">
        <Input
          clearable
          label="Filtrar por codigo"
          placeholder="Filtrar por codigo"
          value={codeFilter}
          onChange={(e) => setcodeFilter(e.target.value)}
          className="max-w-xs"
        />
        <Input
          clearable
          type="text"
          label="Nombre de producto"
          placeholder="Nombre de producto"
          value={nameFilter}
          onChange={(e) => setnameFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div>
        <h1 className="text-sm font-bold">Productos a mostrar por pagina</h1>
        <div className="flex py-2 my-1">
          <button
            className={`mx-1 text-sm p-1 ${
              pageSize === 10
                ? "bg-gray-500 opacity-50   rounded-md text-white font-bold"
                : "bg-blue-600   rounded-md text-white font-bold"
            }`}
            onClick={() => {
              if (products.length > 9) {
                setpageSize(10);
                setpageNum(1);
                setcodeFilter("");
                setnameFilter("");
              }
            }}
          >
            10
          </button>
          <button
            onClick={() => {
              if (products.length > 49) {
                setpageSize(50);
                setpageNum(1);
                setcodeFilter("");
                setnameFilter("");
              }
            }}
            className={`mx-1 text-sm p-1 ${
              pageSize === 50
                ? "bg-gray-500 opacity-50  rounded-md text-white font-bold"
                : "bg-blue-600   rounded-md text-white font-bold"
            }`}
          >
            50
          </button>
          <button
            onClick={() => {
              if (products.length > 50) {
                setpageSize(100);
                setpageNum(1);
                setcodeFilter("");
                setnameFilter("");
              }
            }}
            className={`mx-1 text-sm p-1 ${
              pageSize === 100
                ? "bg-gray-500 opacity-50  rounded-md text-white font-bold"
                : "bg-blue-600   rounded-md text-white font-bold"
            }`}
          >
            100
          </button>
        </div>
      </div>
      <Table
        aria-label="Tabla de productos"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
        className="h-[450px]"
      >
        <TableHeader>
          <TableColumn className=" font-bold ">Código</TableColumn>
          <TableColumn className=" font-bold ">Nombre</TableColumn>
          <TableColumn className=" flex items-center font-bold ">
            <h1 className="flex ">Precio Costo </h1>
          </TableColumn>
          <TableColumn className=" font-bold ">
            <h1 className="flex">Precio Venta </h1>
          </TableColumn>
          <TableColumn className=" font-bold ">Proveedor</TableColumn>
          <TableColumn className=" font-bold ">Stock</TableColumn>
          <TableColumn className=" font-bold ">Acciones</TableColumn>
        </TableHeader>
        <TableBody className="border rounded-lg">
          {productspaginate.map((product) => (
            <TableRow key={product._id} className="">
              <TableCell className="border border-blue-600 font-bold ">
                {product.code}
              </TableCell>
              <TableCell className="border border-blue-600 font-bold ">
                {product.name}
              </TableCell>
              <TableCell className="border border-blue-600 font-bold ">
                ${product.priceCost.toLocaleString("es-co")}
              </TableCell>
              <TableCell className="border border-blue-600 font-bold ">
                ${product.priceSell.toLocaleString("es-co")}
              </TableCell>
              <TableCell className="border border-blue-600 font-bold ">
                {product.supplier}
              </TableCell>
              <TableCell className="border border-blue-600 font-bold ">
                {product.stock}
              </TableCell>
              <TableCell className="border border-blue-600 font-bold ">
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
                ></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center items-center my-5 ">
        <button
          onClick={() => {
            if (pageNum > 1) {
              setpageNum(pageNum - 1);
              setcodeFilter("");
              setnameFilter("");
            }
          }}
          className={`${
            pageNum > 1 ? "bg-blue-600" : "bg-gray-500 opacity-50"
          } p-2 text-white rounded-md `}
        >
          <FaChevronLeft />
        </button>
        <h1 className="mx-4 font-bold">{pageNum}</h1>
        <button
          className={` ${
            productspaginate.length === pageSize
              ? "bg-blue-600"
              : "bg-gray-500 opacity-50"
          } p-2 text-white rounded-md `}
          onClick={() => {
            if (productspaginate.length > pageSize - 1) {
              setpageNum(pageNum + 1);
              setcodeFilter("");
              setnameFilter("");
            }
          }}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
