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
  FilterProducts,
  GetProductAPI,
  PaginationProducts,
} from "../../Controllers/Product.controller";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import useListProducts from "../../Controllers/useListProducts";
import AlertDialog from "../Modals/AlertDialog";

export default function ListProduct() {
  const [FilterText, setFilterText] = useState("");
  const [pageNum, setpageNum] = useState(0);
  const [pageSize, setpageSize] = useState(10);
  const [totalPages, settotalPages] = useState(0);
  const {
    NumDisminuir,
    OnChangeDisminuir,
    onChangeDialogState,
    IdEditing,
    isEditing,
    onCancelDialog,
    DialogState,
    onConfirmDialog,
    products,
    setProducts,
  } = useListProducts();

  useEffect(() => {
    PaginationProducts({ pageIndex: pageNum, pageSize }).then((data) => {
      setProducts(data.data.products);
      settotalPages(data.data.total);
    });
  }, [pageNum]);

  const onChangeFilter = (text) => {
    setFilterText(text);
  };

  const onHandleFindProducts = () => {
    if (FilterText.length > 0) {
      FilterProducts({ text: FilterText, pageNum: 0, pageSize: 10 }).then(
        (data) => {
          setProducts(data.data.products);
        }
      );
    }
  };

  useEffect(() => {
    if (FilterText.length === 0) {
      PaginationProducts({ pageIndex: pageNum, pageSize }).then((data) => {
        setProducts(data.data.products);
        settotalPages(data.data.total);
      });
    }
  }, [FilterText]);

  const handleDelete = useCallback(async (id) => {
    DeleteProductAPI({ id });
    setProducts((products) => products.filter((product) => product._id !== id));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer containerId={11} />
      <AlertDialog
        message={
          isEditing
            ? "Desea disminuir el stock de este producto?"
            : "Desea eliminar este producto?"
        }
        title={isEditing ? "Disminuir stock" : "Eliminar producto"}
        onchangeState={onChangeDialogState}
        onCancel={onCancelDialog}
        onConfirm={onConfirmDialog}
        state={DialogState}
      />
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <Input
          clearable
          label="Filtrar por codigo y nombre"
          placeholder="Filtrar por codigo y nombre"
          value={FilterText}
          onChange={(e) => onChangeFilter(e.target.value)}
          className="max-w-xs"
        />
        <Button color="primary" onClick={() => onHandleFindProducts()}>
          {"Buscar"}
        </Button>
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
                setFilterText("");
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
                setFilterText("");
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
                setFilterText("");
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
          {products.map((product) => (
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
              <TableCell className="border border-blue-600 font-bold  w-[45%]">
                <div className="flex ">
                  <Button
                    color="error"
                    auto
                    onClick={() => handleDelete(product._id)}
                  >
                    <FaTrashAlt className="text-xl text-red-500" />
                  </Button>

                  <div className="flex items-center gap-3">
                    <Button
                      color="warning"
                      className="text-white "
                      onClick={() => {
                        OnChangeDisminuir(-1, product);
                        console.log(product.code);
                      }}
                      isDisabled={!isEditing || IdEditing != product.code}
                    >
                      -
                    </Button>
                    <h1>{IdEditing === product.code ? NumDisminuir : 0}</h1>
                    <Button
                      color="danger"
                      className="text-white "
                      onClick={() => OnChangeDisminuir(1, product)}
                      isDisabled={isEditing && IdEditing !== product.code}
                    >
                      +
                    </Button>

                    {NumDisminuir > 0 && IdEditing == product.code ? (
                      <Button
                        color="success"
                        className="text-white"
                        onClick={() => onChangeDialogState(true)}
                      >
                        Remover
                      </Button>
                    ) : null}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center items-center my-5 ">
        <button
          disabled={pageNum === 0}
          onClick={() => {
            if (pageNum > 0) {
              setpageNum(pageNum - 1);
              setFilterText("");
            }
          }}
          className={`${
            pageNum > 0 ? "bg-blue-600" : "bg-gray-500 opacity-50"
          } p-2 text-white rounded-md `}
        >
          <FaChevronLeft />
        </button>
        <h1 className="mx-4 font-bold">{pageNum}</h1>
        <button
          disabled={totalPages <= pageNum * pageSize}
          className={` ${
            totalPages > pageNum * pageSize
              ? "bg-blue-600"
              : "bg-gray-500 opacity-50"
          } p-2 text-white rounded-md `}
          onClick={() => {
            if (totalPages > pageSize - 1) {
              setpageNum(pageNum + 1);
              setFilterText("");
            }
          }}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
