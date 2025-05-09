import React, { useEffect, useRef } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
function TicketsTable({ productos, eliminarProducto, guardarRegistro, editarProducto}) {
  const ref = useRef();
  useEffect(() => {
    if (productos.length > 7) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [productos]);
  return (
    <div className="mx-5">
      <h2 className="text-xl font-semibold mb-2 text-blue-500 my-2">
        Productos ingresados
      </h2>
      <div
        className="overflow-x-auto overflow-scroll h-72 border rounded-sm bg-white"
        ref={ref}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Numero
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Precio Venta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Cantidad Tickets
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y  divide-gray-900">
            {productos.map((producto, i) => (
              <tr key={i}>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  {i + 1}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  {producto.codigo}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  {producto.nombre}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  ${producto.precioVenta.toLocaleString("es-co")}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  {producto.cantidad}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  <button
                    onClick={() => editarProducto(producto.id)}
                    className="text-indigo-600 text-xs lg:text-base hover:text-indigo-900 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() =>
                      eliminarProducto(producto._id, producto.cantidad)
                    }
                    className="text-red-600 text-xs lg:text-base  hover:text-red-900"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}

export default TicketsTable;
