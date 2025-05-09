import React from 'react'
import { FaTrashAlt } from "react-icons/fa";

function TableProducts({productspaginate, handleDelete}) {
  return (
    <table className="min-w-full bg-white border border-gray-900  ">
        <thead className='border border-gray-900 bg-slate-50'>
          <tr className='border-b-1 border-gray-900 group hover:cursor-pointer hover:bg-slate-50 transition-all duration-300'>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Código</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              Precio Costo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              Precio Venta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              Proveedor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {productspaginate.map((product) => (
            <tr key={product._id} className="border-b-1 border-gray-900 group hover:cursor-pointer hover:bg-slate-50 ">
              <td className="px-6 py-4 whitespace-nowrap text-sm transition-all duration-300 group-hover:text-xl font-medium text-gray-900">{product.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm transition-all duration-300 group-hover:text-xl text-gray-900">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm transition-all duration-300 group-hover:text-xl text-gray-900">
                ${product.priceCost.toLocaleString("es-co")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm transition-all duration-300 group-hover:text-xl text-gray-900">
                ${product.priceSell.toLocaleString("es-co")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm transition-all duration-300 group-hover:text-xl text-gray-900">{product.supplier}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm transition-all duration-300 group-hover:text-xl text-gray-900">{product.stock}</td>
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