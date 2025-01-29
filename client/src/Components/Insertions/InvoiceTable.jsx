import React, { useEffect, useRef } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
function InvoiceTable({productos, eliminarProducto, editarProducto}) {

  const refScroll = useRef(null);
  //AutoScrollTop
  useEffect(() => {
    if (productos.length > 9) {
      refScroll.current.scrollTop = refScroll.current.scrollHeight;
    }
  }, [productos]);

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-2 text-gray-200 my-2">
        Productos en la Factura
      </h2>
      <div
        className="overflow-x-auto overflow-scroll h-72 border rounded-sm bg-gray-900  "
        ref={refScroll}
      >
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Descuento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className=" divide-y  divide-gray-200 ">
            {productos.map((producto) => (
              <tr key={producto.id} className="border-b-1 border-gray-200">
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  {producto.codigo}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  {producto.nombreProducto}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  ${producto.precio.toLocaleString("es-co")}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  {producto.descuento}%
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  {producto.cantidad}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider ">
                  $
                  {(
                    producto.precio *
                    producto.cantidad *
                    (1 - producto.descuento / 100)
                  ).toLocaleString("es-co")}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
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

export default InvoiceTable;
