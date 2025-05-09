import {useDisclosure } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import FinishInvoice from "../Modals/FinishInvoice";
import {
  GETPRODUCTBYCODE,
} from "../../Controllers/Product.controller";

import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import FindProductByName from "../Insertions/FindProductByName";
import InvoiceTable from "../Insertions/invoiceTable";
import AddToTabe from "../Insertions/AddToTabe";
import TitleForTables from "../Insertions/TitleForTables";
export default function CreateInvoice() {
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
  const [DBProducts, setDBProducts] = useState([]);
  const [fullInvoice, setfullInvoice] = useState(null);
  const [idIndividualProduct, setidIndividualProduct] = useState(null);
  const [individualMaxProduct, setindividualMaxProduct] = useState(0);
  const [productFilterByName, setproductFilterByName] = useState([]);
  const [InvoiceDiscont, setInvoiceDiscont] = useState(0);
  const [DiscontSection, setDiscontSection] = useState(false);
  const [VerifyProductIn, setVerifyProductIn] = useState(0);
  const [globalError, setglobalError] = useState(false)
 const [Key, setKey] = useState("")
  const refInputPN = useRef(null);
  const refSave = useRef(null)
  const refCode = useRef(null)
  //Reset Input Functions
   const resetInputsF = () => {
    setCodigo("");
    setisFilterBycode(false);
    setNombreProducto("");
    setPrecio("");
    setidIndividualProduct("");
    setindividualMaxProduct("");
    setCantidad(1);
    setDescuento(0);
  };


  

  useEffect(() => {
    document.addEventListener("keydown", (e) => setKey(e.key))
    refCode.current.focus()
  }, [])
  

  //error management

  const [codeFully, setCodeFully] = useState(false);
  const [inputDiscount, setinputDiscount] = useState(false);
  useEffect(() => {
    if (codigo.length < 4) {
      setCodeFully(false);
      setisFilterBycode(false)
      
    }else filterProductByCode(codigo)

    
  }, [codigo]);

  useEffect(() => {
    console.log(Key)
  }, [Key])
  
  useEffect(() => {
    if(isFilterBycode){
      setTimeout(() => {
        if(Key === "Enter"){
          refSave.current.requestSubmit()
        }
      }, 50)
    }
  }, [isFilterBycode])
  
  
  useEffect(() => {
      if(codeFully ){
        setglobalError(true)
      }else {
        setglobalError(false)
      }

  }, [codeFully, inputDiscount])
  


  //Filtrar producto por codigo

  const filterProductByCode = async (codigo) => {
    if (codigo.length === 4) {
      
      const verify = DBProducts.some((p) => p.code === codigo);
      if (!verify) {
        try {
          const data = await GETPRODUCTBYCODE({ code: codigo });
          const individualProduct = data.data.product;
          if (data) {
            const validation = DBProducts.some(
              (p) => p.code === individualProduct.code
            );
            if (!validation) setDBProducts([...DBProducts, individualProduct]);
            if (individualProduct) {
              setCodeFully(false);
              setNombreProducto(individualProduct.name);
              setPrecio(individualProduct.priceSell);
              setidIndividualProduct(individualProduct._id);
              setindividualMaxProduct(individualProduct.stock);
              setisFilterBycode(true);
              
              
            } else {
              setisFilterBycode(false);
            }
          }
        } catch (error) {
          setCodeFully(true);
          if(nombreProducto.length > 1){
            setTimeout(() => {
              resetInputsF()
            }, 500)
          }
        }
      } else {
        const individualProduct = DBProducts.filter(
          (p) => p.code === codigo
        )[0];
        if (individualProduct) {
          setisFilterBycode(true);
          setNombreProducto(individualProduct.name);
          setPrecio(individualProduct.priceSell);
          setidIndividualProduct(individualProduct._id);
          setindividualMaxProduct(individualProduct.stock);
        } else {
          setisFilterBycode(false);
        }
      }
    }
  };

  //discoun all the invoice

  useEffect(() => {
    if (isNaN(InvoiceDiscont) || InvoiceDiscont === 0) {
      setProductos(
        productos.map((n) => {
          n.descuento = 0;
          return n;
        })
      );
    } else {
      if (productos.length > 0 && !isNaN(InvoiceDiscont)) {
        setProductos(
          productos.map((n) => {
            n.descuento = InvoiceDiscont;
            return n;
          })
        );
        setinputDiscount(false);
      }

      if (productos.length === 0) {
        setinputDiscount(true);
        setInvoiceDiscont("");
      }
    }
  }, [InvoiceDiscont, VerifyProductIn]);

  //Agregar productos a la factura


  

  const AddAndEditProducts = (e) => {
    e.preventDefault();
    if (idIndividualProduct) {
      const pt = DBProducts.filter((p) => {
        if (p._id === idIndividualProduct) {
          p.stock = p.stock - cantidad;
          return p;
        }
      });

      if (!productos.some((p) => p.codigo === codigo)) {
        const productToAdd = {
          _id: idIndividualProduct,
          id: +new Date(),
          codigo,
          precio,
          precioCosto: pt[0].priceCost,
          cantidad,
          nombreProducto,
          descuento,
        };


        setProductos([...productos, productToAdd]);
        resetInputsF();

        if (InvoiceDiscont === 0) {
          setInvoiceDiscont(0);
        } else {
          setVerifyProductIn(VerifyProductIn + 1);
        }
      } else {
        const AddnewAmount = productos.filter((p) => {
          if (p.codigo === codigo) {
            p.cantidad = p.cantidad + cantidad;
            p.descuento = descuento
          }

          return p;
        });

        setProductos(AddnewAmount);
        resetInputsF();
      }
      refCode.current.focus()
    }

    if (editandoId) {
      const editingProducts = productos.filter((p) => {
        if (p.id === editandoId) {
          p.cantidad = cantidad;
          p.descuento = descuento;
          p.precio = precio;
          DBProducts.filter((e) => {
            if (e._id === p._id) {
              e.stock = e.stock - cantidad;
            }
          });
        }
        return p;
      });

      setProductos(editingProducts);
      setEditandoId(null);
      setindividualMaxProduct(0);
      resetInputsF();
      refCode.current.focus()
    }
  };

  const editarProducto = (id) => {
    const productFilter = productos.filter((p) => {
      if (p.id === id) {
        return p;
      }
    })[0];

    const { cantidad, codigo, descuento, nombreProducto, precio, _id } =
      productFilter;
    setCodigo(codigo);
    setCantidad(cantidad);
    setNombreProducto(nombreProducto);
    setDescuento(descuento);
    setPrecio(precio);

    const affectPDB = DBProducts.filter((a) => {
      if (a._id === _id) {
        a.stock = a.stock + cantidad;
      }
      return a;
    });

    setindividualMaxProduct(
      affectPDB.filter((e) => {
        if (e._id == _id) {
          return e.stock;
        }
      })[0].stock
    );

    setDBProducts(affectPDB);
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

  const finishFactura = () => {
    // Aquí iría la lógica para guardar la factura
    if (productos.length > 0) {
      setfullInvoice({
        productos,
        total: calcularTotal(),
        totalMoney: 0,
        date: formattedDate,
        paymentMethod: null
      });

      onOpen();
    } else
      toast.warning(`No hay productos que facturar`, {
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
    <div className=" bg-white h-screen grid ">
      <ToastContainer containerId={2} />
      <div className="space-y-2  ">
        
        <div className="px-5">
        <TitleForTables Label={"Facturero"} />
          <form
          ref={refSave}
            autoComplete="off"
            onSubmit={(e) => globalError ? e.preventDefault() : AddAndEditProducts(e) }
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
              ref={refCode}
                id="codigo"
                type="text"
                minLength={4}
                maxLength={4}
                placeholder="Codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                className={`w-full px-3  py-1 ${
                  !codeFully
                    ? "bg-white border border-blue-500  rounded focus:border-primary "
                    : "bg-red-800 opacity-50 border focus:border-red-700 border-red-700 "
                } text-gray-900`}
              />
              <h1 className="  text-sm text-red-700 opacity-50 ">
                {codeFully ? "No existe este codigo" : null}
              </h1>
            </div>
            <div  >

              <label
                htmlFor="nombreProducto"
                className="block text-sm  lg:text-base font-normal text-gray-900  mb-1"
              >
                Nombre del Producto
              </label>
              <input
                readOnly={isFilterBycode}
                id="nombreProducto"
                type="text"
                ref={refInputPN}
                placeholder="Filtra el nombre del producto"
                value={nombreProducto}
                
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
                className="w-full px-3 py-1 bg-white border border-blue-500  rounded focus:border-primary text-gray-900"
              />
              <FindProductByName
                name={nombreProducto}
                refInput ={refInputPN ? refInputPN : null}
                setters={{
                  setCodigo,
                  setNombreProducto,
                  setidIndividualProduct,
                  setPrecio,
                  setindividualMaxProduct,
                  setproductFilterByName,
                }}
                isFilterByCode={isFilterBycode}
              />
            </div>
            <div>
              <label
                htmlFor="precio"
                className="block text-sm  lg:text-base font-normal text-gray-900 mb-1"
              >
                Precio
              </label>
              <input
                id="precio"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                min="0"
                placeholder="Precio"
                step="0.01"
                required
                className="w-full px-3 py-1 bg-white border border-blue-500 rounded focus:border-primary text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="descuento"
                className="block text-sm  lg:text-base font-normal text-gray-900 mb-1"
              >
                Descuento (%)
              </label>
              <input
                id="descuento"
                type="number"
                value={descuento}
                placeholder="Porcentaje descuento"
                onChange={(e) => setDescuento(e.target.value)}
                min="0"
                max="100"
                className="w-full px-3 py-1 bg-white border border-blue-500  rounded focus:border-primary text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="cantidad"
                className="block text-sm  lg:text-base font-normal text-gray-900 mb-1"
              >
                Cantidad
              </label>
              <input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                min="1"
                placeholder="Cantidad a llevar"
                max={individualMaxProduct}
                required
                className="w-full px-3 py-1 bg-white border border-blue-500  rounded focus:border-primary text-gray-900"
              />
            </div>
            <AddToTabe editandoId={editandoId} label={"Agregar producto a factura"} />
          </form>
        </div>

       <div className="px-5">
       <InvoiceTable productos={productos} eliminarProducto={eliminarProducto} editarProducto={editarProducto} />
          <div className="mt-3 flex justify-between  items-center">
            <span className="text-xl font-semibold text-white  cursor-pointer bg-blue-500 shadow-md hover:bg-blue-600 transition-all p-2 rounded-md ">
              Total: <label className="hover:text-2xl transition-all" htmlFor="">${calcularTotal().toLocaleString("es-co")}</label>
            </span>

            {DiscontSection ? (
              <div className="  bg-blue-500 w-72 shadow-md border border-blue-400 rounded-md p-2 ">
                <label htmlFor="" className="text-white font-light ">
                  Porcentaje de descuento a la factura
                </label>
                <input
                  type="number"
                  placeholder="Porcentaje %"
                  value={InvoiceDiscont}
                  onChange={(e) => setInvoiceDiscont(parseInt(e.target.value))}
                  className={`w-full px-3  py-1 ${
                    !inputDiscount
                      ? "bg-white-800 border border-gray-700 rounded-md focus:border-primary "
                      : "bg-red-800 opacity-50 border focus:border-red-700 border-red-700 "
                  } text-gray-900`}
                />
                <h1 className="  text-sm text-red-700 opacity-50 ">
                  {inputDiscount
                    ? "No hay productos para hacer descuento "
                    : null}
                </h1>
              </div>
            ) : null}

            <div>
              <button
                onClick={() => setDiscontSection(!DiscontSection)}
                className=" text-white py-1  px-4 mr-3  bg-blue-500 hover:bg-blue-600 transition duration-300 border border-blue-400 shadow-md rounded-md"
              >
                Agregar descuento a la factura
              </button>

              <button
                onClick={finishFactura}
                className=" text-white py-1  px-4 shadow-md rounded-md bg-emerald-500 hover:bg-emerald-600 transition duration-300 border border-emerald-400"
              >
                Guardar Factura
              </button>
            </div>
          </div>
        </div>
      </div>

      <FinishInvoice
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        data={fullInvoice}
        setProductos={setProductos}
        setDiscount={setInvoiceDiscont}
      />
    </div>
  );
}
