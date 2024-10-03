import { useContext, useEffect, useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import WelcomeWindow from "./Components/windows/WelcomeWindow";
import { WinContext } from "./Context/WindowsContext";
import CreateProduct from "./Components/windows/CreateProduct";
import CreateInvoice from "./Components/windows/CreateInvoice";
import ListProducts from "./Components/windows/ListProducts";
import SeeSells from "./Components/windows/SeeSells";
import RegisterNewProducts from "./Components/windows/RegisterNewProducts";

function App() {
  const { principalWindows, setPrincipalWindows } = useContext(WinContext);

  
  return (
    <>
      
        <Navbar />
        {Object.keys(principalWindows).filter(win => principalWindows[win] === true).length > 0 ? null : <WelcomeWindow/>}
        {principalWindows.create_product ? <CreateProduct /> : null}
        {principalWindows.create_invoice ? <CreateInvoice /> : null}
        {principalWindows.see_product_list ? <ListProducts /> : null}
        {principalWindows.see_sells ? <SeeSells /> : null}
        {principalWindows.see_product_sells ? <RegisterNewProducts /> : null}
     
    </>
  );
}

export default App;
