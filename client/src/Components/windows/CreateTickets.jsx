import { useDisclosure } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import FinishInvoice from "../Modals/FinishInvoice";
import {
  GetProductAPI,
  UpdateProductsAPI,
} from "../../Controllers/Product.controller";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { GenerateTicketsAPI } from "../../Controllers/Tickets.controller";
import TicketsTable from "../Insertions/TicketsTable";
import AddToTabe from "../Insertions/AddToTabe";
import TitleForTables from "../Insertions/TitleForTables";

export default function CreateTickets() {
  const [productFilterByName, setproductFilterByName] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioVenta, setprecioVenta] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [isFilterBycode, setisFilterBycode] = useState(false);
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [DBProducts, setDBProducts] = useState(null);
  const [GenerateTicked, setGenerateTicked] = useState(true);
  const [productExist, setproductExist] = useState(false);

  useEffect(() => {
    const data = new Promise((res, rej) => {
      const data = GetProductAPI();
      data ? res(data) : rej({ message: "Error" });
    });
    data
      .then((data) => setDBProducts(data.data))
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }, []);

  const ref = useRef();
  const refFocus = useRef();

  useEffect(() => {
    if (productos.length > 7) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [productos]);

  useEffect(() => {
    if (codigo) {
      const verify = DBProducts.filter((p) => p.code === codigo);
      if (verify.length > 0) {
        setproductExist(true);
      } else setproductExist(false);
    }
  }, [codigo]);

  const agregarProducto = (e) => {
    e.preventDefault();
    if (productExist) {
      if (editandoId !== null) {
        setProductos(
          productos.map((p) =>
            p.id === editandoId
              ? {
                  ...p,
                  codigo,
                  nombre: nombreProducto,
                  precioVenta,
                  cantidad,
                }
              : p
          )
        );
        setEditandoId(null);
        setisFilterBycode(false);
      } else {
        setProductos([
          ...productos,
          {
            id: Date.now(),
            codigo,
            nombre: nombreProducto,
            precioVenta,
            cantidad,
          },
        ]);
      }
      setCodigo("");
      setNombreProducto("");
      setprecioVenta("");
      setCantidad("");
      setisFilterBycode(false);
      refFocus.current.focus();
    } else
      toast.error(`El producto que intenta agregar no existe`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
  };

  const editarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    setisFilterBycode(true);
    if (producto) {
      setCodigo(producto.codigo);
      setNombreProducto(producto.nombre);
      setprecioVenta(producto.precioVenta);
      setCantidad(producto.cantidad);
      setEditandoId(id);
    }
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const guardarRegistro = async () => {
    // Aquí iría la lógica para guardar la factura
    if (productos.length > 0) {
      try {
        const response = await GenerateTicketsAPI({ productos });
        if (response.status === 400) {
          toast.warning(
            `Error con BARTENDER, comuniquese con el desarrollador`,
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
        } else {
          toast.success("Registrados correctamente", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setProductos([]);
        }
      } catch (error) {
        toast.error(error, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } else
      toast.warning("No hay productos que registrar", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
  };

  return (
    <div className="bg-gray-900 h-screen grid">
      <ToastContainer containerId={10} />
      <div>
        <div className="px-5">
        <TitleForTables Label={"Generador"} />
          <form
            autoComplete="off"
            onSubmit={agregarProducto}
            className="grid grid-cols-1  md:grid-cols-5 gap-2"
          >
            <div>
              <label
                htmlFor="codigo"
                className="block text-sm   lg:text-base font-normal text-gray-200 mb-1"
              >
                Código
              </label>
              <input
                id="codigo"
                type="text"
                value={codigo}
                ref={refFocus}
                onChange={(e) => {
                  setCodigo(e.target.value);
                  const filterProduct = DBProducts.filter(
                    (product) => product.code == e.target.value
                  );

                  if (filterProduct[0]) {
                    setNombreProducto(filterProduct[0].name);
                    setisFilterBycode(true);
                    setprecioVenta(filterProduct[0].priceSell);
                  } else {
                    setisFilterBycode(false);
                  }
                }}
                required
                className="w-full px-3 py-1 bg-gray-800 border border-gray-700 focus:border-primary text-gray-200"
              />
            </div>
            <div>
              <label
                htmlFor="nombreProducto"
                className="block text-sm   lg:text-base font-normal text-gray-200 mb-1"
              >
                Nombre del Producto
              </label>
              <input
                id="nombreProducto"
                type="text"
                value={nombreProducto}
                onChange={(e) => {
                  const valuer = e.target.value.toLocaleLowerCase();
                  setNombreProducto(valuer);
                  const productFilter = DBProducts.filter((p) =>
                    p.name.toLowerCase().includes(valuer)
                  );
                  if (valuer.length > 0) {
                    setproductFilterByName(productFilter);
                  } else {
                    setproductFilterByName([]);
                  }
                }}
                required
                className="w-full px-3 py-1 bg-gray-800 border border-gray-700 focus:border-primary text-gray-200"
              />

              <div
                className={`absolute overflow-y-scroll bg-blue-500 text-white h-36 w-64 my-2 rounded-md  ${
                  productFilterByName.length == 0 ? "hidden" : "block"
                }`}
              >
                {productFilterByName.length > 0
                  ? productFilterByName.map((e, i) => {
                      return (
                        <div
                          key={i}
                          className="hover:bg-white w-full pl-1 cursor-pointer py-2 border-b hover:text-blue-500 transition-all"
                        >
                          <button
                            className="w-full text-start"
                            onClick={() => {
                              setCodigo(e.code);
                              setNombreProducto(e.name);
                              setprecioVenta(e.priceSell);
                              setproductFilterByName([]);
                            }}
                          >
                            {e.name}
                          </button>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
            <div>
              <label
                htmlFor="cantidad"
                className="block text-sm   lg:text-base font-normal text-gray-200 mb-1"
              >
                Cantidad
              </label>
              <input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                required
                className="w-full px-3 py-1 bg-gray-800 border border-gray-700 focus:border-primary text-gray-200"
              />
            </div>
            <AddToTabe editandoId={editandoId} label={"Agregar Producto para generar"}/>
          </form>
        </div>

        <TicketsTable
          eliminarProducto={eliminarProducto}
          productos={productos}
          guardarRegistro={guardarRegistro}
        />
        <div className="ml-5 mt-6 flex justify-between items-center">
          <button
            onClick={guardarRegistro}
            className=" text-white py-1  px-4  bg-emerald-500 hover:bg-emerald-400 transition duration-300 border border-emerald-900"
          >
            Guardar registro
          </button>
        </div>
      </div>
    </div>
  );
}
