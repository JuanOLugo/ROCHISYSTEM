import { useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import FinishInvoice from "../Modals/FinishInvoice";
import { GetProductAPI, UpdateProductsAPI } from "../../Controllers/Product.controller";


export default function RegisterNewProducts() {
  const [nombreCliente, setNombreCliente] = useState("");
  const [identificacionCliente, setIdentificacionCliente] = useState("");
  const [nombreVendedor, setNombreVendedor] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [codigo, setCodigo] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioCosto, setprecioCosto] = useState(null);
  const [precioVenta, setprecioVenta] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [isFilterBycode, setisFilterBycode] = useState(false)
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [DBProducts, setDBProducts] = useState(null);
  const [fullRegister, setFullRegister] = useState(null);

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
                precioCosto,
                precioVenta,
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
          precioCosto,
          precioVenta,
          cantidad,
        },
      ]);
    }
    setCodigo("");
    setNombreProducto("");
    setprecioCosto("");
    setprecioVenta("")
    setCantidad("");
    setisFilterBycode(false)
  };

  const editarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    setisFilterBycode(true)
    if (producto) {
      setCodigo(producto.codigo);
      setNombreProducto(producto.nombre);
      setprecioCosto(producto.precioCosto);
      setprecioVenta(producto.precioVenta);
      setCantidad(producto.cantidad);
      setEditandoId(id);
    }
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };



  
  const guardarFactura = async () => {
    // Aquí iría la lógica para guardar la factura
    if (productos.length > 0) {
      try {
        UpdateProductsAPI({productos})
        alert("Registrados correctamente")
        setProductos([])
      } catch (error) {
        alert(error)
      }

    } else alert("No hay productos que facturar");
  };

  return (
    <div className="container mx-auto my-5">
      <div className="space-y-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Actualizar producto
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
                    setisFilterBycode(true)
                    setprecioCosto(filterProduct[0].priceCost)
                    setprecioVenta(filterProduct[0].priceSell)
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
                htmlFor="costPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio de costo
              </label>
              <input
                id="costPrice"
                type="number"
                value={precioCosto}
                onChange={(e) => setprecioCosto(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="sellPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio de venta
              </label>
              <input
                id="sellPrice"
                type="number"
                value={precioVenta}
                onChange={(e) => setprecioVenta(e.target.value)}
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
                  : "Agregar Producto Registrado"}
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
                    Precio Costo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Venta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto) => (
                  <tr key={producto._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {producto.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {producto.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${producto.precioCosto.toLocaleString("es-co")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${producto.precioVenta.toLocaleString("es-co")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {producto.cantidad}
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
            <button
              onClick={guardarFactura}
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
