import { useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import FinishInvoice from "../Modals/FinishInvoice";
import { GetProductAPI } from "../../Controllers/Product.controller";
export default function CreateInvoice() {
  const [nombreCliente, setNombreCliente] = useState("");
  const [identificacionCliente, setIdentificacionCliente] = useState("");
  const [nombreVendedor, setNombreVendedor] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [codigo, setCodigo] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [precio, setPrecio] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [isFilterBycode, setisFilterBycode] = useState(false)
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [DBProducts, setDBProducts] = useState(null);
  const [fullInvoice, setfullInvoice] = useState(null);

  useEffect(() => {
    const data = new Promise((res, rej) => {
      const data = GetProductAPI();
      data ? res(data) : rej({ message: "Error" });
    });
    data.then((data) => setDBProducts(data.data));
  }, []);

  const agregarProducto = (e) => {
    e.preventDefault();
    if (editandoId !== null) {
      
      setProductos(
        productos.map((p) =>
          p.id === editandoId
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
      setisFilterBycode(false)
    } else {
      setProductos([
        ...productos,
        {
          id: Date.now(),
          codigo,
          nombre: nombreProducto,
          precio,
          descuento,
          cantidad,
        },
      ]);
    }
    setCodigo("");
    setNombreProducto("");
    setPrecio(0);
    setDescuento(0);
    setCantidad(1);
    setisFilterBycode(false)
  };

  const editarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    setisFilterBycode(true)
    if (producto) {
      setCodigo(producto.codigo);
      setNombreProducto(producto.nombre);
      setPrecio(producto.precio);
      setDescuento(producto.descuento);
      setCantidad(producto.cantidad);
      setEditandoId(id);
    }
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const calcularTotal = () => {
    return productos.reduce((total, producto) => {
      return (
        total +
        producto.precio * producto.cantidad * (1 - producto.descuento / 100)
      );
    }, 0);
  };

  const guardarFactura = () => {
    // Aquí iría la lógica para guardar la factura
    if (productos.length > 0) {
      setfullInvoice({
        nombreCliente,
        identificacionCliente,
        nombreVendedor,
        productos,
        total: calcularTotal(),
      });
      
      onOpen();
    } else alert("No hay productos que facturar");
  };

  return (
    <div className="container mx-auto my-5">
      <div className="space-y-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Información del Cliente y Vendedor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="nombreCliente"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del Cliente (Opcional)
              </label>
              <input
                id="nombreCliente"
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="identificacionCliente"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Identificación del Cliente (Opcional)
              </label>
              <input
                id="identificacionCliente"
                type="text"
                value={identificacionCliente}
                onChange={(e) => setIdentificacionCliente(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="nombreVendedor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del Vendedor (Opcional)
              </label>
              <input
                id="nombreVendedor"
                type="text"
                value={nombreVendedor}
                onChange={(e) => setNombreVendedor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Agregar Producto
          </h2>
          <form
            onSubmit={agregarProducto}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <div>
              <label
                htmlFor="codigo"
                className="block text-sm font-medium text-gray-700 mb-1"
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
                    setPrecio(filterProduct[0].price);
                    setisFilterBycode(true)
                  }else{
                    setisFilterBycode(false)
                  }
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="nombreProducto"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del Producto
              </label>
              <input
                readOnly={isFilterBycode}
                id="nombreProducto"
                type="text"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="precio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio
              </label>
              <input
                id="precio"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="descuento"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descuento (%)
              </label>
              <input
                id="descuento"
                type="number"
                value={descuento}
                onChange={(e) => setDescuento(Number(e.target.value))}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="cantidad"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cantidad
              </label>
              <input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="md:col-span-5">
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300"
              >
                {editandoId !== null
                  ? "Actualizar Producto"
                  : "Agregar Producto"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Productos en la Factura
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descuento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {producto.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {producto.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${producto.precio.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {producto.descuento}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {producto.cantidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      $
                      {(
                        producto.precio *
                        producto.cantidad *
                        (1 - producto.descuento / 100)
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => editarProducto(producto.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto.id)}
                        className="text-red-600 hover:text-red-900"
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
            <span className="text-xl font-bold">
              Total: ${calcularTotal().toFixed(2)}
            </span>
            <button
              onClick={guardarFactura}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
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
      />
    </div>
  );
}
