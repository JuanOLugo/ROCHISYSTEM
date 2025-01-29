import React from 'react'
import { FaTrashAlt } from "react-icons/fa";

function TableProducts({productspaginate, handleDelete}) {
  return (
    <table className="min-w-full bg-gray-800 border border-gray-700 ">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Código</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Precio Costo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Precio Venta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Proveedor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {productspaginate.map((product) => (
            <tr key={product._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{product.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                ${product.priceCost.toLocaleString("es-co")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                ${product.priceSell.toLocaleString("es-co")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{product.supplier}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{product.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 mr-2">
                  <FaTrashAlt className="text-xl" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  )
}

export default TableProducts