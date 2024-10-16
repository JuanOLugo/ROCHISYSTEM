import { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { Navigate , Link} from "react-router-dom";
export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };



  const opcionesMenu = [
    {
      texto: "Crear producto",
      action: "/createproduct",
    },
    {
      texto: "Crear factura",
      action: "/createinvoice",
    },
    {
      texto: "Ver mis productos",
      action: "/listproducts",
    },
    {
      texto: "Ver mis ventas",
      action: "/seesells",
    },
    {
      texto: "Ingresar inventario",
      action: "/registernewproducts",
    },
    {
      texto: "Abrir ventana",
      href: "http://localhost:5173",
    },
  ];

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <a href="#" className="flex items-center py-4 px-2">
                <span className="font-semibold text-xl">Rochi System</span>
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {opcionesMenu.map((opcion, index) => (
              <div key={index}>
                {opcion.href ? (
                  <a
                    href={opcion.href}
                    className="py-2 px-3 rounded-md hover:bg-primary-foreground hover:text-primary transition duration-300"
                    target="_blank"
                  >
                    {opcion.texto}
                  </a>
                ) : (
                  <button>
                    <Link
                    key={index}
                    to={opcion.action}
                    className="py-2 px-3 rounded-md hover:bg-primary-foreground hover:text-primary transition duration-300"
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
  );
}
