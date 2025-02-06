import React, { useEffect, useRef, useState } from "react";
import {
  GetProductAPI,
  GETPRODUCTBYCODE,
  UpdateProductsAPI,
} from "../../Controllers/Product.controller";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import RegisterPTable from "../Insertions/RegisterPTable";
import FindProductByName from "../Insertions/FindProductByName";
import AddToTabe from "../Insertions/AddToTabe";
import TitleForTables from "../Insertions/TitleForTables";

export default function RegisterNewProducts() {
  const [productFilterByName, setproductFilterByName] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioCosto, setprecioCosto] = useState("");
  const [precioVenta, setprecioVenta] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [isFilterBycode, setisFilterBycode] = useState(false);
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [DBProducts, setDBProducts] = useState([]);
  const [fullRegister, setFullRegister] = useState(null);
  const [GenerateTicked, setGenerateTicked] = useState(true);
  const [productExist, setproductExist] = useState(false);
  const [codeFully, setCodeFully] = useState(false);
  const [idIndividualProduct, setidIndividualProduct] = useState(null);

  const ref = useRef();
  const refInputPN = useRef();
  const resetInputsF = () => {
    setCodigo("");
    setisFilterBycode(false);
    setNombreProducto("");
    setprecioCosto("");
    setprecioVenta("");
    setidIndividualProduct(null);
    setCantidad("");
  };

  const filterProductByCode = async (codigo) => {
    if (codigo.length === 4) {
      const verify = DBProducts.some((p) => p.code === codigo);
      if (!verify) {
        console.log("entre");
        try {
          const data = await GETPRODUCTBYCODE({ code: codigo });
          const individualProduct = data.data.product;
          if (data) {
            const validation = DBProducts.some(
              (p) => p.code === individualProduct.code
            );
            if (!validation) setDBProducts([...DBProducts, individualProduct]);
            if (individualProduct) {
              setisFilterBycode(true);
              setNombreProducto(individualProduct.name);
              setidIndividualProduct(individualProduct._id);
              setprecioVenta(individualProduct.priceSell);
              setprecioCosto(individualProduct.priceCost);
              setCodeFully(false);
            } else {
              setisFilterBycode(false);
            }
          }
        } catch (error) {
          setCodeFully(true);
          if (nombreProducto.length > 1) {
            setTimeout(() => {
              resetInputsF();
            }, 500);
          }
        }
      } else {
        const individualProduct = DBProducts.filter(
          (p) => p.code === codigo
        )[0];
        if (individualProduct) {
          setisFilterBycode(true);
          setNombreProducto(individualProduct.name);
          setidIndividualProduct(individualProduct._id);
          setprecioVenta(individualProduct.priceSell);
          setprecioCosto(individualProduct.priceCost);
        } else {
          setisFilterBycode(false);
        }
      }
    }
  };

  useEffect(() => {
    if (!editandoId) {
      if (codigo.length < 4) {
        setCodeFully(false);
        setisFilterBycode(false);
      } else filterProductByCode(codigo);
    }
  }, [codigo]);

  useEffect(() => {
    if (productos.length > 7) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [productos]);

  useEffect(() => {
    console.log(productos);
  }, [productos]);

  const AddAndEditProducts = (e) => {
    e.preventDefault();
    if (idIndividualProduct) {
      if (!productos.some((p) => p.codigo === codigo)) {
        const productToAdd = {
          _id: idIndividualProduct,
          id: +new Date(),
          codigo,
          precioVenta,
          precioCosto,
          cantidad,
          nombre: nombreProducto,
          GenerateTicked,
        };

        setProductos([...productos, productToAdd]);
        resetInputsF();
      } else {
        const AddnewAmount = productos.filter((p) => {
          if (p.codigo === codigo) {
            p.cantidad = p.cantidad + cantidad;
            p.GenerateTicked = GenerateTicked;
            p.precioCosto = precioCosto;
            p.precioVenta = precioVenta;
            p.nombre = nombreProducto;
          }
          return p;
        });
        setProductos(AddnewAmount);
        resetInputsF();
      }
    }

    if (editandoId) {
      const editingProducts = productos.filter((p) => {
        if (p.id === editandoId) {
          p.nombre = nombreProducto;
          p.precioCosto = parseInt(precioCosto);
          p.cantidad = cantidad;
          p.precioVenta = parseInt(precioVenta);
          p.GenerateTicked = GenerateTicked;
        }
        return p;
      });

      setProductos(editingProducts);
      setEditandoId(null);
      resetInputsF();
    }
  };

  const editarProducto = (id) => {
    const productFilter = productos.filter((p) => {
      if (p.id === id) {
        return p;
      }
    })[0];

    const {
      cantidad,
      codigo,
      nombre,
      precioVenta,
      precioCosto,
      GenerateTicked,
    } = productFilter;

    console.log(productFilter);
    setCodigo(codigo);
    setCantidad(cantidad);
    setNombreProducto(nombre);
    setprecioCosto(precioCosto);
    setprecioVenta(precioVenta);
    setGenerateTicked(GenerateTicked);
    setEditandoId(id);
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

  const guardarRegistro = async () => {
    // Aquí iría la lógica para guardar la factura
    if (productos.length > 0) {
      try {
        await UpdateProductsAPI({ productos });
        toast.success("Productos registrados correctamente", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          
        });
        setProductos([]);
      } catch (error) {
        toast.error(error.response.data, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          
        });
      }
    } else
      toast.warning("No hay productos que facturar", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        
      });
  };

  return (
    <div className="bg-gray-900 h-screen grid">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div>
        <div className=" px-5">
          <TitleForTables Label={"Registro"} />
          <form
            autoComplete="off"
            onSubmit={AddAndEditProducts}
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
                autoComplete="off"
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
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
                ref={refInputPN}
                onChange={(e) => {
                  setNombreProducto(e.target.value);
                  const valuer = e.target.value.toLowerCase();
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
              <FindProductByName
                name={nombreProducto}
                setters={{ setCodigo }}
                refInput={refInputPN ? refInputPN : null}
              />
            </div>
            <div>
              <label
                htmlFor="costPrice"
                className="block text-sm   lg:text-base font-normal text-gray-200 mb-1"
              >
                Precio de costo
              </label>
              <input
                id="costPrice"
                type="number"
                value={precioCosto}
                onChange={(e) => setprecioCosto(e.target.value)}
                required
                className="w-full px-3 py-1 bg-gray-800 border border-gray-700 focus:border-primary text-gray-200"
              />
            </div>
            <div>
              <label
                htmlFor="sellPrice"
                className="block text-sm   lg:text-base font-normal text-gray-200 mb-1"
              >
                Precio de venta
              </label>
              <input
                id="sellPrice"
                type="number"
                value={precioVenta}
                onChange={(e) => setprecioVenta(e.target.value)}
                className="w-full px-3 py-1 bg-gray-800 border border-gray-700 focus:border-primary text-gray-200"
              />
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
            <div className=" flex  ">
              <label
                htmlFor="costPrice"
                className="block text-sm   lg:text-base font-normal text-gray-200 mb-1"
              >
                Generar Ticket
              </label>
              <input
                id="costPrice"
                type="checkbox"
                checked={GenerateTicked}
                onChange={(e) => setGenerateTicked(e.target.checked)}
                className="ml-5 scale-150"
              />
            </div>
            <AddToTabe editandoId={editandoId} label={"Agregar producto para ingresar"}/>
          </form>
        </div>

        <RegisterPTable
          productos={productos}
          refScroll={ref}
          editarProducto={editarProducto}
          eliminarProducto={eliminarProducto}
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
