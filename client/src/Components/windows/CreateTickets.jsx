import { useDisclosure } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import FinishInvoice from "../Modals/FinishInvoice";
import {
  GetProductAPI,
  GETPRODUCTBYCODE,
  UpdateProductsAPI,
} from "../../Controllers/Product.controller";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { GenerateTicketsAPI } from "../../Controllers/Tickets.controller";
import TicketsTable from "../Insertions/TicketsTable";
import AddToTabe from "../Insertions/AddToTabe";
import TitleForTables from "../Insertions/TitleForTables";
import FindProductByName from "../Insertions/FindProductByName";
import { set } from "date-fns";

export default function CreateTickets() {
  const [productFilterByName, setproductFilterByName] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioVenta, setprecioVenta] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [isFilterBycode, setisFilterBycode] = useState(false);
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [DBProducts, setDBProducts] = useState([]);
  const [GenerateTicked, setGenerateTicked] = useState(true);
  const [productExist, setproductExist] = useState(false);
  const [IdIndividualProduct, setIdIndividualProduct] = useState(null);
  const refInputPN = useRef();

  const ref = useRef();
  const refFocus = useRef();

  useEffect(() => {
    if (productos.length > 7) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [productos]);

  const filterProductByCode = async (codigo) => {
    if (codigo.length === 4) {
      const verify = DBProducts.some((p) => p.code === codigo);
      console.log(!verify);
      if (!verify) {
        try {
          const data = await GETPRODUCTBYCODE({ code: codigo });
          console.log(data);
          const individualProduct = data.data.product;

          if (data) {
            const validation = DBProducts.some(
              (p) => p.code === individualProduct.code
            );
            if (!validation) setDBProducts([...DBProducts, individualProduct]);
            if (individualProduct) {
              setisFilterBycode(true);
              setNombreProducto(individualProduct.name);
              setCodigo(individualProduct.code);
              setprecioVenta(individualProduct.priceSell);
              setIdIndividualProduct(individualProduct._id);
              return true;
            } else {
              setisFilterBycode(false);
              return false;
            }
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      } else {
        const individualProduct = DBProducts.filter(
          (p) => p.code === codigo
        )[0];
        console.log(individualProduct);
        if (individualProduct) {
          setisFilterBycode(true);
          setNombreProducto(individualProduct.name);
          setprecioVenta(individualProduct.priceSell);
          setIdIndividualProduct(individualProduct._id);
          setCodigo(individualProduct.code);
          return true;
        } else {
          setisFilterBycode(false);
          return false;
        }
      }
    }
  };

  const AddAndEditProducts = (e) => {
    e.preventDefault();
    if (IdIndividualProduct) {
      if (!productos.some((p) => p.codigo === codigo)) {
        const productToAdd = {
          _id: IdIndividualProduct,
          id: +new Date(),
          codigo,
          precioVenta,
          cantidad,
          nombre: nombreProducto,
        };

        setProductos([...productos, productToAdd]);
        setCodigo("");
        setNombreProducto("");
        setprecioVenta("");
        setCantidad("");
        setisFilterBycode(false);
        setIdIndividualProduct(null);
      } else {
        const AddnewAmount = productos.filter((p) => {
          if (p.codigo === codigo) {
            p.cantidad = cantidad;
            p.precioVenta = precioVenta;
            p.nombre = nombreProducto;
          }
          return p;
        });
        setProductos(AddnewAmount);
        setCodigo("");
        setNombreProducto("");
        setprecioVenta("");
        setCantidad("");
        setisFilterBycode(false);
        setIdIndividualProduct(null);
      }
    }

    if (editandoId) {
      const editingProducts = productos.filter((p) => {
        if (p.id === editandoId) {
          p.nombre = nombreProducto;
          p.cantidad = cantidad;
          p.precioVenta = parseInt(precioVenta);
        }
        return p;
      });

      setProductos(editingProducts);
      setEditandoId(null);
      setCodigo("");
      setNombreProducto("");
      setprecioVenta("");
      setCantidad("");
      setisFilterBycode(false);
      setIdIndividualProduct(null);
    }
  };

  const editarProducto = (id) => {
    const productFilter = productos.filter((p) => {
      if (p.id === id) {
        return p;
      }
    })[0];

    const { cantidad, codigo, nombre, precioVenta } = productFilter;

    console.log(productFilter);
    setCodigo(codigo);
    setCantidad(cantidad);
    setNombreProducto(nombre);
    setprecioVenta(precioVenta);
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

  const guardarRegistro = async () => {
    // Aquí iría la lógica para guardar la factura
    if (productos.length > 0) {
      try {
        const response = await GenerateTicketsAPI({ productos });
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
        }
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

  useEffect(() => {
    if (codigo.length === 4) {
      filterProductByCode(codigo);
    }
  }, [codigo]);

  return (
    <div className="bg-white h-screen grid">
      <ToastContainer containerId={102} />
      <div>
        <div className="px-5">
          <TitleForTables Label={"Generador"} />
          <form
            autoComplete="off"
            onSubmit={AddAndEditProducts}
            className="grid grid-cols-1  md:grid-cols-5 gap-2"
          >
            <div>
              <label
                htmlFor="codigo"
                className="block text-sm   lg:text-base font-normal text-gray-900 mb-1"
              >
                Código
              </label>
              <input
                id="codigo"
                type="text"
                value={codigo}
                ref={refFocus}
                placeholder="Código del producto"
                onChange={(e) => {
                  setCodigo(e.target.value);
                  const filterProduct = DBProducts.filter(
                    (product) => product.code == e.target.value
                  );

                  if (filterProduct[0]) {
                    setNombreProducto(filterProduct[0].name);
                    setisFilterBycode(true);
                    setprecioVenta(filterProduct[0].priceSell);
                  } else {
                    setisFilterBycode(false);
                  }
                }}
                required
                className="w-full px-3 py-1 bg-white border border-gray-700 focus:border-primary text-gray-900 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="nombreProducto"
                className="block text-sm   lg:text-base font-normal text-gray-900 mb-1"
              >
                Nombre del Producto
              </label>
              <input
                id="nombreProducto"
                type="text"
                ref={refInputPN}
                value={nombreProducto}
                placeholder="Nombre del producto"
                onChange={(e) => {
                  const valuer = e.target.value.toLocaleLowerCase();
                  setNombreProducto(valuer);
                }}
                required
                className="w-full px-3 py-1 bg-white border border-gray-700 focus:border-primary text-gray-900 rounded-md"
              />

              <FindProductByName
                name={nombreProducto}
                setters={{ setCodigo }}
                refInput={refInputPN ? refInputPN : null}
              />
            </div>
            <div>
              <label
                htmlFor="cantidad"
                className="block text-sm   lg:text-base font-normal text-gray-900 mb-1"
              >
                Cantidad
              </label>
              <input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                required
                placeholder="0"
                className="w-full px-3 py-1 bg-white border border-gray-700 focus:border-primary text-gray-900 rounded-md"
              />
            </div>
            <AddToTabe
              editandoId={editandoId}
              label={"Agregar Producto para generar"}
            />
          </form>
        </div>

        <TicketsTable
          eliminarProducto={eliminarProducto}
          productos={productos}
          guardarRegistro={guardarRegistro}
          editarProducto={editarProducto}
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
