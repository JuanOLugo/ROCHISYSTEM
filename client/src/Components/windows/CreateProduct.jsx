import { useState } from 'react'
import {customAlphabet} from "nanoid"
import { CreateProductAPI } from '../../Controllers/Product.controller'

export default function CreateProduct() {
  const codeGen = customAlphabet("123456789", 4)
  const [codigo, setCodigo] = useState(codeGen())
  const [nombre, setNombre] = useState('')
  const [PrecioCosto, setPrecioCosto] = useState("")
  const [Precioventa, setPrecioventa] = useState("")
  const [proveedor, setProveedor] = useState('')
  const [stock, setStock] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar el producto
    const dataToSend = { codigo, nombre, PrecioCosto, Precioventa ,proveedor, stock }
    try {
      await CreateProductAPI(dataToSend)
      setCodigo(codeGen())  
      setNombre("")
      setPrecioCosto("")
      setPrecioventa("")
      setProveedor("")
      setStock("")
    } catch (error) {
      alert(error.response.data.message)
    }
    
  }

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">Crear Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                Código de Producto
              </label>
              <input
              readOnly
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ingrese el código del producto"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Producto
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese el nombre del producto"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                Precio de costo
              </label>
              <input
                id="precio"
                type="number"
                value={PrecioCosto}
                onChange={(e) => setPrecioCosto(e.target.value)}
                placeholder="Ingrese el precio del producto"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                Precio de venta
              </label>
              <input
                id="precio"
                type="number"
                value={Precioventa}
                onChange={(e) => setPrecioventa(e.target.value)}
                placeholder="Ingrese el precio del producto"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700 mb-1">
                Proveedor (Opcional)
              </label>
              <input
                id="proveedor"
                type="text"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                placeholder="Ingrese el proveedor del producto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
                placeholder="Ingrese el stock del producto"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300"
            >
              Guardar Producto
            </button>
          </form>
        </div>
        
        <div className="hidden md:block w-64 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">Código de Barras</h2>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
            <svg
              className="w-24 h-24 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}