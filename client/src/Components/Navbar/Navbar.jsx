import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { Link, NavLink} from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [OnIn, setOnIn] = useState(true)
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const location = useLocation();

  const opcionesMenu = [
    {
      texto: "Crear producto ➕",
      action: "/createproduct",
    },
    {
      texto: "Crear factura 📃",
      action: "/createinvoice",
    },
    {
      texto: "Ver mis productos 🧦",
      action: "/listproducts",
    },
    {
      texto: "Ver mis ventas 📈",
      action: "/seesells",
    },
    {
      texto: "Ingresar inventario 🗳️",
      action: "/registernewproducts",
    },
    {
      texto: "Generar tickers ✂️",
      action: "/createtickets",
    },
    {
      texto: "💻",
      href: "/",
    },

  ];

  return (
    <>
    <div className={`absolute w-full h-11 top-0 left-0  ${OnIn ? "hidden" : "block"}`} onMouseEnter={() => setOnIn(true)}></div>
      <nav className={` bg-gray-900 text-gray-200 shadow-lg border-b transition-all duration-500  ${!OnIn ? "-top-52 absolute w-full" : "top-0 relative"} border-gray-700`}  onMouseLeave={() => setOnIn(false)}>
      
      <div className="max-w-6xl mx-auto py-2 px-5 md:px-0 ">
        <div className="flex justify-between">
          <div className="flex">
            <div>
              <a href="#" className=" ">
                <span className="font-bold uppercase text-xl"><NavLink to={"/"}>Rochi System ♥️</NavLink></span>
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1 ">
            {opcionesMenu.map((opcion, index) => (
              <div key={index}>
                {opcion.href ? (
                  <a
                    href={opcion.href}
                    className="py-2 px-3 rounded-md hover:bg-primary-foreground text-sm hover:text-primary transition duration-300"
                    target="_blank"
                  >
                    {opcion.texto}
                  </a>
                ) : (
                  <button>
                    <Link
                    key={index}
                    to={opcion.action}
                    target={location.pathname === opcion.action ? "_blank" : "_self"}
                    className={`py-2 px-3 rounded-md hover:bg-primary-foreground ${location.pathname === opcion.action ? "text-primary bg-primary-foreground  " : ""} text-sm  hover:text-primary transition duration-300`}
                  >
                    {opcion.texto}
                  </Link>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <button className="outline-none" onClick={toggleMenu}>
              {menuAbierto ? <IoClose /> : <IoMdMenu />}
            </button>
          </div>
        </div>
      </div>
      <div className={`md:hidden ${menuAbierto ? "block" : "hidden"}`}>
        {opcionesMenu.map((opcion, index) => (
          <Link
            to={opcion.action}
            key={index}
            onClick={() => {
              setMenuAbierto(!menuAbierto);
            }}
            className="block w-full text-start py-2 px-4 text-sm hover:bg-primary-foreground hover:text-primary transition duration-300"
          >
            {opcion.texto}
          </Link>
        ))}
      </div>
    </nav>
    </>
  );
}
