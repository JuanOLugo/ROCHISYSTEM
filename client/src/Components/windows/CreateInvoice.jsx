import { useDisclosure } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import FinishInvoice from "../Modals/FinishInvoice";
import { GetProductAPI } from "../../Controllers/Product.controller";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
export default function CreateInvoice() {
  // const [nombreCliente, setNombreCliente] = useState("");
  //const [identificacionCliente, setIdentificacionCliente] = useState("");
  //const [nombreVendedor, setNombreVendedor] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const date = new Date();
  const formattedDate = format(date, "yyyy-MM-dd");
  const [codigo, setCodigo] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [precio, setPrecio] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [isFilterBycode, setisFilterBycode] = useState(false);
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [DBProducts, setDBProducts] = useState(null);
  const [fullInvoice, setfullInvoice] = useState(null);
  const [idIndividualProduct, setidIndividualProduct] = useState(null);
  const [individualMaxProduct, setindividualMaxProduct] = useState(0);
  const [productExist, setproductExist] = useState(false);
  const [productFilterByName, setproductFilterByName] = useState([]);
  const [WaitVerification, setWaitVerification] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (productos.length > 9) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [productos]);

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
    if (codigo) {
      const verify = DBProducts.filter((p) => p.code === codigo);
      if (verify.length > 0) {
        setproductExist(true);
      } else setproductExist(false);
    }

    setWaitVerification(true);
  }, [codigo]);

  const agregarProducto = (e) => {
    e.preventDefault();
    const verify = DBProducts.filter((p) => p.code === codigo);
    if (verify.length > 0) {
      if (editandoId !== null) {
        const affectPDB = DBProducts.filter((a) => {
          if (a._id === editandoId) {
            a.stock = a.stock - cantidad;
          }
          return a;
        });
        setDBProducts(affectPDB);
        setProductos(
          productos.map((p) =>
            p._id === editandoId
              ? {
                  ...p,
                  codigo,
                  nombre: nombreProducto,
                  precio,
                  descuento,
                  cantidad,
                }
              : p
          )
        );
        setEditandoId(null);
        setisFilterBycode(false);
        setindividualMaxProduct(0);
      } else {
        const ff = productos.filter((e) => e.codigo == codigo);
        if (ff.length > 0) {
          const findIfProductExistIn = ff.reduce((acumulador, producto) => {
            if (producto.codigo === codigo) {
              return producto.cantidad + cantidad;
            }
            return acumulador;
          }, null);

          ff[0].cantidad = findIfProductExistIn;

          const affectPDB = DBProducts.filter((a) => {
            if (a._id === idIndividualProduct) {
              a.stock = a.stock - cantidad;
            }
            return a;
          });
          setDBProducts(affectPDB);
        } else {
          const affectPDB = DBProducts.filter((a) => {
            if (a._id === idIndividualProduct) {
              a.stock = a.stock - cantidad;
            }
            return a;
          });
          setDBProducts(affectPDB);
          setProductos([
            ...productos,
            {
              _id: idIndividualProduct,
              codigo,
              nombre: nombreProducto,
              precio,
              descuento,
              cantidad,
            },
          ]);
        }
      }

      setCodigo("");
      setNombreProducto("");
      setPrecio(0);
      setDescuento(0);
      setCantidad(1);
      setisFilterBycode(false);
      setidIndividualProduct(null);
      setindividualMaxProduct(100);
    } else
      toast.error(`CODIGO: ${codigo} No existe`, {
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
    const producto = productos.find((p) => p._id === id);
    setisFilterBycode(true);
    if (producto) {
      setCodigo(producto.codigo);
      setNombreProducto(producto.nombre);
      setPrecio(producto.precio);
      setDescuento(producto.descuento);
      setCantidad(producto.cantidad);

      const affectPDB = DBProducts.filter((a) => {
        if (a._id === id) {
          a.stock = a.stock + producto.cantidad;
        }
        return a;
      });

      setindividualMaxProduct(
        affectPDB.filter((e) => {
          if (e._id == id) {
            return e.stock;
          }
        })[0].stock
      );
      setDBProducts(affectPDB);
      setEditandoId(id);
    }
  };

  const eliminarProducto = (id, stock) => {
    const renewStock = DBProducts.filter((p) => {
      if (p._id === id) {
        p.stock = p.stock + stock;
      }

      return p;
    });
    setDBProducts(renewStock);
    setProductos(productos.filter((p) => p._id !== id));
  };

  const calcularTotal = () => {
    return productos.reduce((total, producto) => {
      return (
        total +
        producto.precio * producto.cantidad * (1 - producto.descuento / 100)
      );
    }, 0);
  };

  const finishFactura = () => {
    // Aquí iría la lógica para guardar la factura
    if (productos.length > 0) {
      setfullInvoice({
        productos,
        total: calcularTotal(),
        totalMoney: 0,
        date: formattedDate,
        paymentMethod: null,
      });

      onOpen();
    } else toast.warning(`No hay productos que facturar`, {
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
      <ToastContainer containerId={2}/>
      <div className="space-y-2 ">
        {/*<div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Información del Cliente y Vendedor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="nombreCliente"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Nombre del Cliente (Opcional)
              </label>
              <input
                id="nombreCliente"
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="identificacionCliente"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Identificación del Cliente (Opcional)
              </label>
              <input
                id="identificacionCliente"
                type="text"
                value={identificacionCliente}
                onChange={(e) => setIdentificacionCliente(e.target.value)}
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="nombreVendedor"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Nombre del Vendedor (Opcional)
              </label>
              <input
                id="nombreVendedor"
                type="text"
                value={nombreVendedor}
                onChange={(e) => setNombreVendedor(e.target.value)}
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>*/}

        <div className="bg-white shadow-lg sticky top-0 rounded-lg  p-2">
          <form
            onSubmit={agregarProducto}
            className="grid grid-cols-1  md:grid-cols-5 gap-4"
          >
            <div>
              <label
                htmlFor="codigo"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Código
              </label>
              <input
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
                    setPrecio(filterProduct[0].priceSell);
                    setisFilterBycode(true);
                    setidIndividualProduct(filterProduct[0]._id);
                    setindividualMaxProduct(filterProduct[0].stock);
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
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Nombre del Producto
              </label>
              <input
                readOnly={isFilterBycode}
                id="nombreProducto"
                type="text"
                value={nombreProducto}
                onChange={(e) => {
                  setNombreProducto(e.target.value);
                  const productFilter = DBProducts.filter((p) =>
                    p.name.toLowerCase().includes(e.target.value)
                  );
                  if (e.target.value.length > 0) {
                    setproductFilterByName(productFilter);
                  } else {
                    setproductFilterByName([]);
                  }
                }}
                required
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <div
                className={`absolute overflow-y-scroll bg-blue-500 text-white h-28 w-48 my-2 rounded-md  ${
                  productFilterByName.length == 0 ? "hidden" : "block"
                }`}
              >
                {productFilterByName.length > 0
                  ? productFilterByName.map((e, i) => {
                      return (
                        <div
                          key={i}
                          className="hover:bg-white w-full pl-1 cursor-pointer hover:text-blue-500 transition-all"
                        >
                          <button
                            className="w-full text-start"
                            onClick={() => {
                              setCodigo(e.code);
                              setNombreProducto(e.name);
                              setPrecio(e.priceSell);
                              setproductFilterByName([]);
                              setidIndividualProduct(e._id);
                              setindividualMaxProduct(e.stock);
                            }}
                          >
                            {e.name}{" "}
                          </button>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
            <div>
              <label
                htmlFor="precio"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Precio
              </label>
              <input
                id="precio"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-1 border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="descuento"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Descuento (%)
              </label>
              <input
                id="descuento"
                type="number"
                value={descuento}
                onChange={(e) => setDescuento(e.target.value)}
                min="0"
                max="100"
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="cantidad"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Cantidad
              </label>
              <input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                min="1"
                max={individualMaxProduct}
                required
                className="w-full px-3 py-1  border border-black rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="md:col-span-5">
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-1  px-4 rounded-md hover:bg-primary-dark transition duration-300"
              >
                {editandoId !== null
                  ? "Actualizar Producto"
                  : "Agregar Producto"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow-lg rounded-lg px-3 py-1">
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Productos en la Factura
          </h2>
          <div className="overflow-x-auto overflow-scroll h-64" ref={ref}>
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Descuento
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-1 text-left text-xs font-bold border border-black text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 ">
                {productos.map((producto) => (
                  <tr key={producto._id} className="border-b-1 border-black">
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black">
                      {producto.codigo}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black">
                      {producto.nombre}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black">
                      ${producto.precio.toLocaleString("es-co")}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs  font-bold border border-black">
                      {producto.descuento}%
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black">
                      {producto.cantidad}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-bold border border-black ">
                      $
                      {(
                        producto.precio *
                        producto.cantidad *
                        (1 - producto.descuento / 100)
                      ).toLocaleString("es-co")}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap border text-xs border-black  font-bold">
                      <button
                        onClick={() => editarProducto(producto._id)}
                        className="text-indigo-600 text-xs hover:text-indigo-900 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          eliminarProducto(producto._id, producto.cantidad)
                        }
                        className="text-red-600 text-xs  hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xl font-bold">
              Total: ${calcularTotal().toLocaleString("es-co")}
            </span>
            <button
              onClick={finishFactura}
              className="bg-green-500 text-white py-1  px-4 rounded-md hover:bg-green-600 transition duration-300"
            >
              Guardar Factura
            </button>
          </div>
        </div>
      </div>

      <FinishInvoice
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        data={fullInvoice}
        setProductos={setProductos}
      />
    </div>
  );
}
