import { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { WinContext } from "../../Context/WindowsContext";
import { useBadge } from "@nextui-org/react";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const { principalWindows, setPrincipalWindows } = useContext(WinContext);

  const HandlePrincipalWindow = (keyToSetTrue) => {
    return Object.keys(principalWindows).reduce((newState, key) => {
      newState[key] = key === keyToSetTrue ? true : false;
      return newState;
    }, {});
  };


  const opcionesMenu = [
    {
      texto: "Crear producto",
      action: "create_product",
    },
    {
      texto: "Crear factura",
      action: "create_invoice",
    },
    {
      texto: "Ver mis productos",
      action: "see_product_list",
    },
    {
      texto: "Ver mis ventas",
      action: "see_sells",
    },
    {
      texto: "Registrar inventario",
      action: "see_product_sells",
    },
    {
      texto: "Abrir ventana",
      href: "http://localhost:5173"
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
              <div>
                {
                opcion.href ? <a href={opcion.href}  className="py-2 px-3 rounded-md hover:bg-primary-foreground hover:text-primary transition duration-300" target="_blank">{opcion.texto}</a> : <button
                key={index}
                onClick={() =>
                  setPrincipalWindows(HandlePrincipalWindow(opcion.action))
                }
                className="py-2 px-3 rounded-md hover:bg-primary-foreground hover:text-primary transition duration-300"
              >
                {opcion.texto}
              </button>
              }
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
          <button
            key={index}
            onClick={() =>
            {
                setPrincipalWindows(HandlePrincipalWindow(opcion.action))
                setMenuAbierto(!menuAbierto)
            }
              }
            className="block w-full text-start py-2 px-4 text-sm hover:bg-primary-foreground hover:text-primary transition duration-300"
          >
            {opcion.texto}
          </button>
        ))}
        
      </div>
    </nav>
  );
}
