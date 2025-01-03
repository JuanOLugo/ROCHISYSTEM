import { useDisclosure } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import FinishInvoice from "../Modals/FinishInvoice";
import {
  GetProductAPI,
  UpdateProductsAPI,
} from "../../Controllers/Product.controller";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function RegisterNewProducts() {
  const [nombreCliente, setNombreCliente] = useState("");
  const [identificacionCliente, setIdentificacionCliente] = useState("");
  const [nombreVendedor, setNombreVendedor] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [productFilterByName, setproductFilterByName] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioCosto, setprecioCosto] = useState("");
  const [precioVenta, setprecioVenta] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [isFilterBycode, setisFilterBycode] = useState(false);
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [DBProducts, setDBProducts] = useState(null);
  const [fullRegister, setFullRegister] = useState(null);
  const [GenerateTicked, setGenerateTicked] = useState(true);
  const [productExist, setproductExist] = useState(false);

  useEffect(() => {
    const data = new Promise((res, rej) => {
      const data = GetProductAPI();
      data ? res(data) : rej({ message: "Error" });
    });
    data
      .then((data) => setDBProducts(data.data))
      .catch((err) =>
        console.log("Recuerda que: " + err.response.data.message)
      );
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      window.addEventListener("beforeunload", () => {
        if (productos.length > 0) {
          const mensaje = "¿Estás seguro de que quieres salir?";
          event.returnValue = mensaje; // Para navegadores modernos return mensaje; // Para navegadores antiguos
        }
      });

      return () => {
        window.removeEventListener("beforeunload", () => {
          if (productos.length > 0) {
            const mensaje = "¿Estás seguro de que quieres salir?";
            event.returnValue = mensaje; // Para navegadores modernos return mensaje; // Para navegadores antiguos
          }
        });
      };
    }
  }, [productos]);

  const ref = useRef();

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
                  precioCosto,
                  precioVenta,
                  cantidad,
                  GenerateTicked,
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
            precioCosto,
            precioVenta,
            cantidad,
            GenerateTicked,
          },
        ]);
      }
      setCodigo("");
      setNombreProducto("");
      setprecioCosto("");
      setprecioVenta("");
      setCantidad("");
      setisFilterBycode(false);
      setGenerateTicked(true);
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
      setprecioCosto(producto.precioCosto);
      setprecioVenta(producto.precioVenta);
      setCantidad(producto.cantidad);
      setEditandoId(id);
      setGenerateTicked(producto.GenerateTicked);
    }
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const guardarRegistro = async () => {
    // Aquí iría la lógica para guardar la factura
    if (productos.length > 0) {
      try {
        const response = await UpdateProductsAPI({ productos });
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
    <div className="container mx-auto my-5">
      <ToastContainer containerId={10} />
      <div className="space-y-2">
        <div className="bg-white shadow-lg sticky top-0 rounded-lg  p-2">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Actualizar producto
          </h2>
          <form
            autoComplete="off"
            onSubmit={agregarProducto}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <div>
              <label
                htmlFor="codigo"
                className="block text-xs font-bold text-gray-700 mb-1"
              >
                Código
              </label>
              <input
              autoComplete="off"
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value);
                  const filterProduct = DBProducts.filter(
                    (product) => product.code == e.target.value
                  );

                  if (filterProduct[0]) {
                    setNombreProducto(filterProduct[0].name);
                    setisFilterBycode(true);
                    setprecioCosto(filterProduct[0].priceCost);
                    setprecioVenta(filterProduct[0].priceSell);
                  } else {
                    setisFilterBycode(false);
                  }
                }}
                required
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="nombreProducto"
                className="block text-xs font-bold text-gray-700 mb-1"
              >
                Nombre del Producto
              </label>
              <input
                id="nombreProducto"
                type="text"
                value={nombreProducto}
                onChange={(e) => {
                  
                  setNombreProducto(e.target.value);
                  const valuer = e.target.value.toLowerCase()
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
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
                              setprecioCosto(e.priceCost)
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
                htmlFor="costPrice"
                className="block text-xs font-bold text-gray-700 mb-1"
              >
                Precio de costo
              </label>
              <input
                id="costPrice"
                type="number"
                value={precioCosto}
                onChange={(e) => setprecioCosto(e.target.value)}
                required
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="sellPrice"
                className="block text-xs font-bold text-gray-700 mb-1"
              >
                Precio de venta
              </label>
              <input
                id="sellPrice"
                type="number"
                value={precioVenta}
                onChange={(e) => setprecioVenta(e.target.value)}
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="cantidad"
                className="block text-xs font-bold text-gray-700 mb-1"
              >
                Cantidad
              </label>
              <input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                required
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div className=" flex  ">
              <label
                htmlFor="costPrice"
                className="block mr-5 text-xs font-bold text-gray-700 mb-1"
              >
                Generar Ticket
              </label>
              <input
                id="costPrice"
                type="checkbox"
                checked={GenerateTicked}
                onChange={(e) => setGenerateTicked(e.target.checked)}
                className="scale-150"
              />
            </div>
            <div className="md:col-span-5">
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-1  px-4 rounded-md hover:bg-primary-dark transition duration-300"
              >
                {editandoId !== null
                  ? "Actualizar Producto"
                  : "Agregar Producto Registrado"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow-lg rounded-lg px-3 py-1">
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Productos ingresados
          </h2>
          <div className="overflow-x-auto overflow-scroll h-52" ref={ref}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Precio Costo
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Precio Venta
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto, i) => (
                  <tr key={i}>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black">
                      {producto.codigo}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black">
                      {producto.nombre}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black">
                      ${producto.precioCosto.toLocaleString("es-co")}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black">
                      ${producto.precioVenta.toLocaleString("es-co")}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black">
                      {producto.cantidad}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black">
                      {producto.GenerateTicked ? "Si" : "No"}
                    </td>
                    <td className="px-6 py-1 border border-black text-xs whitespace-nowrap  font-bold">
                      <button
                        onClick={() => editarProducto(producto.id)}
                        className="text-indigo-600 text-xs hover:text-indigo-900 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto.id)}
                        className="text-red-600 text-xs hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={guardarRegistro}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
            >
              Guardar registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
