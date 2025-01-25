import { useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
import { CreateProductAPI } from "../../Controllers/Product.controller";
import { GETPRODUCTCODE } from "../../Controllers/Product.controller";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { FaLinesLeaning } from "react-icons/fa6";

export default function CreateProduct() {
  //Basics
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [PrecioCosto, setPrecioCosto] = useState("");
  const [Precioventa, setPrecioventa] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [stock, setStock] = useState("");
  const [ProductIs, setProductIs] = useState("old");

  //Inputs
  const [OpenConfig, setOpenConfig] = useState(false);
  const [isChecked, setisChecked] = useState(false);
  const [MayorTo, setMayorTo] = useState(false);
  const [MinorTo, setMinorTo] = useState(false);
  const [Percent, setPercent] = useState(0);

  //Get product Code ///////////////////////////////////////////////////////////////
  const getCode = async () => {
    try {
      const data = await GETPRODUCTCODE();
      setCodigo(data.data.code);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCode();
  }, []);

  //Reset states or input new values no diferent states
  const resetStates = (states, individualValue) => {
    Object.values(states).forEach((fn) =>
      individualValue.forEach((value, i) => fn(value))
    );
  };

  /////////////////////////////////////////////////////////////////

  //Actions

  useEffect(() => {
    const dataPercent = JSON.parse(window.localStorage.getItem("configPercent") || "{}")
    const dataCheck = window.localStorage.getItem("percentCheck");
    if (dataCheck == "true" && dataPercent) {
      setisChecked(true);
      setPercent(dataPercent.Percent);
      if (!dataPercent.MinorTo && !dataPercent.MayorTo) {
        setMinorTo(true);
        setMayorTo(false);
      }else {
        setMinorTo(dataPercent.MinorTo);
        setMayorTo(dataPercent.MayorTo);
      }
      toast.info(
        `Estas trabajando con porcentajes: ${dataPercent.Percent}% | ${
          dataPercent.MinorTo
            ? "Redondeado a menor"
            : dataPercent.MayorTo
            ? "Redondeado a mayor"
            : "Sin redondeo ACTIVALO!"
        } `,
        {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    } else {
      setisChecked(false);
    }
  }, []);

  useEffect(() => {
    if (isChecked) {
      if (Percent && (MinorTo || MayorTo) && !isNaN(PrecioCosto)) {
        const config = { Percent, MayorTo, MinorTo };
        window.localStorage.setItem("configPercent", JSON.stringify(config));
        var calculoone = parseInt(PrecioCosto) * (parseInt(Percent) / 100);
        var calculoTwo = calculoone + parseInt(PrecioCosto);
        if (MayorTo) {
          calculoTwo = Math.ceil(calculoTwo / 100) * 100;
        } else if (MinorTo) {
          calculoTwo = Math.floor(calculoTwo / 100) * 100;
        } else {
          calculoTwo = Math.round(num / 100) * 100;
        }
        setPrecioventa(calculoTwo);
      }
    }
  }, [Percent, MinorTo, MayorTo, PrecioCosto]);

  //States errors /////////////////////////////////////////////////////////////////////////////////////////////////

  const [Lose, setLose] = useState(false);
  const [codeLenght, setcodeLenght] = useState(false);

  useEffect(() => {
    if (Precioventa) {
      if (parseInt(PrecioCosto) > parseInt(Precioventa)) {
        setLose(true);
      } else setLose(false);
    }
  }, [Precioventa, PrecioCosto]);

  useEffect(() => {
    if (codigo) {
      if (codigo.length > 3) {
        setcodeLenght(false);
      } else setcodeLenght(true);
    }
  }, [codigo]);

  useEffect(() => {
    if (ProductIs === "new") {
      setStock("");
    } else if (ProductIs === "old") {
      setStock(prevStock => prevStock || 0);
    }
  }, [ProductIs]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el producto
    if (!Lose && !codeLenght) {
      const dataToSend = {
        codigo,
        nombre,
        PrecioCosto,
        Precioventa,
        proveedor,
        stock: stock == "" ? 0 : stock,
      };

      try {
        await CreateProductAPI(dataToSend);
        await getCode();
        resetStates(
          {
            setNombre,
            setPrecioCosto,
            setPrecioventa,
            setProveedor,
            setStock,
          },
          ["", "", "", "", ""]
        );
      } catch (error) {
        toast.error(error.response.data.message, {
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
      toast.error("Revise los cuadros rojos a la hora de rellenar todo", {
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
    <div className="  px-3 w-full  bg-gray-900 pt-5 h-screen">
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
      <div className="w-full grid justify-end ">
        <h1
          className=" text-gray-200 text-xl cursor-pointer w-8 p-3"
          onClick={() => {
            setOpenConfig(!OpenConfig);
          }}
        >
          <FaLinesLeaning />
        </h1>
        {!OpenConfig ? null : (
          <div className="right-9  p-3 bg-gray-800 border border-gray-700  text-gray-200 mt-8 absolute">
            <div className="w-80">
              <div className="flex text-gray-200 justify-between ml-2 ">
                <h1 className="font-bold "> Calcular porcentaje </h1>
                <input
                  type="checkbox"
                  name=""
                  id=""
                  checked={isChecked}
                  onChange={(e) => {
                    if (!isChecked) {
                      setisChecked(e.target.checked);
                      window.localStorage.setItem("percentCheck", true);
                      window.localStorage.setItem(
                        "configPercent",
                        JSON.stringify({ Percent, MayorTo, MinorTo })
                      );
                    } else {
                      setisChecked(false);
                      window.localStorage.removeItem("configPercent");
                      window.localStorage.removeItem("percentCheck");
                      resetStates({ setPercent, setMinorTo, setMayorTo }, [
                        0,
                        false,
                        false,
                      ]);
                    }
                  }}
                />
              </div>
              {!isChecked ? null : (
                <div className=" grid  bg-gray-800 border border-gray-700  text-gray-200 mt-2 ">
                  <div className="text-gray-200 m-2 ">
                    <h1 className="font-bold">Porcentaje %</h1>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={Percent}
                      className=" px-1 py-1   bg-gray-800 border border-gray-700  text-gray-200  shadow-sm focus:outline-none focus:ring-primary mt-1 focus:border-primary"
                      placeholder="Cantidad porcentaje"
                      onChange={(e) => {
                        setPercent(e.target.value);
                      }}
                    />
                  </div>
                  <div className="m-2 ">
                    <h1 className="font-bold mb-2">Redondear</h1>
                    <div className="flex ">
                      <div className="flex mr-2">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          checked={MayorTo}
                          onChange={(e) => {
                            setMayorTo(e.target.checked);
                            setMinorTo(false);
                          }}
                        />
                        <h1 className="text-gray-200 ">
                          <FaArrowUp />
                        </h1>
                      </div>
                      <div className="flex mx-2">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          checked={MinorTo}
                          onChange={(e) => {
                            setMinorTo(e.target.checked);
                            setMayorTo(false);
                          }}
                        />
                        <h1 className="text-gray-200 ">
                          <FaArrowDown />
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className=" flex flex-col md:flex-row w-full  ">
        <div className="flex-1  shadow-lg rounded-lg  w-full ">
          <h2 className="text-2xl font-bold mb-4  text-gray-200">
            Crear Producto
          </h2>
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="space-y-4 "
          >
            <div className="flex">
              <div className="mr-2 ">
                <label
                  htmlFor="codigo"
                  className={`block text-sm font-medium ${
                    !codeLenght ? "text-gray-400 " : "text-red-700 opacity-50"
                  }  mb-1`}
                >
                  Código de Producto
                </label>
                <input
                  //readOnly
                  id="codigo"
                  type="text"
                  maxLength={4}
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ingrese el código del producto"
                  required
                  className={`w-full px-3 py-2 text-primary-foreground ${
                    !codeLenght
                      ? "bg-gray-800 border border-gray-700 focus:border-primary "
                      : "bg-red-800 opacity-50 border focus:border-red-700 border-red-700 "
                  }    shadow-sm focus:outline-none focus:ring-primary `}
                />
                <label className="text-red-700 font-light text-sm ">
                  {codigo.length === 4 ? null : "El codigo son 4 numeros"}
                </label>
              </div>

              <div className=" w-full">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Nombre del Producto
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese el nombre del producto"
                  required
                  className="w-full px-3 py-2  bg-gray-800 border border-gray-700  text-gray-200  shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="mr-2 w-1/2 ">
                <label
                  htmlFor="precio"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Precio de costo
                </label>
                <input
                  id="precio"
                  type="number"
                  value={PrecioCosto}
                  onChange={(e) => setPrecioCosto(e.target.value)}
                  placeholder="Ingrese el precio del producto"
                  required
                  className="w-full px-3 py-2  bg-gray-800 border border-gray-700  text-gray-200  shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div className=" w-1/2 ">
                <label
                  htmlFor="precio"
                  className={`block text-sm font-medium ${
                    !Lose ? "text-gray-400 " : "text-red-700 opacity-50"
                  }  mb-1`}
                >
                  Precio de venta
                </label>
                <input
                  id="precio"
                  type="number"
                  value={Precioventa}
                  onChange={(e) => setPrecioventa(e.target.value)}
                  placeholder="Ingrese el precio del producto"
                  required
                  className={`w-full px-3 py-2  ${
                    !Lose
                      ? "bg-gray-800 border border-gray-700 focus:border-primary "
                      : "bg-red-800 opacity-50 border focus:border-red-700 border-red-700 "
                  } text-gray-200  shadow-sm focus:outline-none focus:ring-primary `}
                />
                <label className="text-red-700 font-light text-sm ">
                  {!Lose ? null : "No puede ser menor que el precio de costo"}
                </label>
              </div>
            </div>

            <div className="">
              <label
                htmlFor="proveedor"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Proveedor (Opcional)
              </label>
              <input
                id="proveedor"
                type="text"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                placeholder="Ingrese el proveedor del producto"
                className="w-full px-3 py-2  bg-gray-800 border border-gray-700  text-gray-200  shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex w-full">
              <div className="mr-2 w-1/2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Antiguedad Del producto
                </label>
                <select
                  name=""
                  id=""
                  className=" bg-gray-800 border border-gray-700  text-gray-200 w-full  py-2"
                  onChange={(e) => setProductIs(e.target.value)}
                >
                  <option value="old">Antiguo</option>
                  <option value="new">Nuevo</option>
                </select>
              </div>

              {ProductIs === "old" ? (
                <div className="w-1/2">
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Stock
                  </label>
                  <input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value))}
                    placeholder="Ingrese el stock del producto"
                    required={ProductIs == "old"}
                    className="w-full px-3 py-2  bg-gray-800 border border-gray-700  text-gray-200  shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-primary-foreground py-2 px-4  hover:bg-primary-dark transition duration-300"
            >
              Guardar Producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
