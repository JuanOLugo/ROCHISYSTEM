import { useContext, useEffect, useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import WelcomeWindow from "./Components/windows/WelcomeWindow";

import CreateProduct from "./Components/windows/CreateProduct";
import CreateInvoice from "./Components/windows/CreateInvoice";
import ListProducts from "./Components/windows/ListProducts";
import SeeSells from "./Components/windows/SeeSells";
import RegisterNewProducts from "./Components/windows/RegisterNewProducts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./Components/windows/NotFound";
function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<WelcomeWindow />} />
        <Route path="/createproduct" element={<CreateProduct />} />
        <Route path="/createinvoice" element={<CreateInvoice />} />
        <Route path="/listproducts" element={<ListProducts />} />
        <Route path="/seesells" element={<SeeSells />} />
        <Route path="/registernewproducts" element={<RegisterNewProducts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
