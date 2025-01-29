import React, { useEffect, useRef, useState } from "react";
import { GETPRODUCTBYNAME } from "../../Controllers/Product.controller";

function FindProductByName({ name, setters, refInput }) {
  const [products, setproducts] = useState([]);
  const [handleFocus, sethandleFocus] = useState(false);
  const [handleBlur, sethandleBlur] = useState(true);
  const refContainer = useRef(null);
  useEffect(() => {
    if (handleFocus) {
      GETPRODUCTBYNAME({ name }).then((data) => setproducts(data.data.product));
    }
  }, [name]);


  useEffect(() => {

      const InputRef = refInput.current;
      InputRef.addEventListener("focus", () => {
        sethandleFocus(true);

      });

      window.addEventListener("click", (e) => {
        if(e.target === refContainer.current === false && e.target === refInput.current === false ){
            setproducts([])
            sethandleFocus(false)
        }
      });
  }, [refInput]);


    return (
      <div
        ref={refContainer}
        className={`absolute overflow-y-scroll  bg-gray-800 border border-gray-700 focus:border-primary text-gray-200 h-40 w-72 my-2 rounded-md font-light  ${
          products.length == 0 || !handleFocus ? "hidden" : "block"
        }`}
      >
        {products.length > 0
          ? products.map((e, i) => {
              return (
                
                <div
                  ref={refContainer}
                  key={i}
                  className="hover:bg-white w-full pl-1 cursor-pointer py-2 border-b hover:text-gray-800 transition-all"
                >
                  <h1
                    className="w-full text-start cursor-pointer"
                    onClick={() => {
                      setters.setCodigo(e.code);
                      sethandleBlur(true);
                      sethandleFocus(false);
                      //setproducts([]);
                    }}
                  >
                    {e.name}
                  </h1>
                </div>
              );
            })
          : null}
      </div>
    );
  }


export default FindProductByName;
