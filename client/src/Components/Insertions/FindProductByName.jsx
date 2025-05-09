import React, { useEffect, useRef, useState } from "react";
import { GETPRODUCTBYNAME } from "../../Controllers/Product.controller";

function FindProductByName({ name, setters, refInput, isFilterByCode }) {
  const [products, setproducts] = useState([]);
  const [handleFocus, sethandleFocus] = useState(false);
  const [handleBlur, sethandleBlur] = useState(true);
  const refContainer = useRef(null);
  useEffect(() => {
    if (handleFocus && name.length > 0) {
      GETPRODUCTBYNAME({ name }).then((data) => setproducts(data.data.product));
    }
    console.log(handleFocus, name, isFilterByCode)
    
  }, [name, handleFocus]);


  useEffect(() => {

      const InputRef = refInput.current;
      if(InputRef.value.length > 0 ){
        if(!isFilterByCode){
          sethandleFocus(true)
        }else sethandleFocus(false)
      }else sethandleFocus(false)

      window.addEventListener("click", (e) => {
        if(e.target === refContainer.current === false && e.target === refInput.current === false ){
            setproducts([])
            sethandleFocus(false)
        }
      });
  }, [refInput, name]);


    return (
      <div
        ref={refContainer}
        className={`absolute overflow-y-scroll  bg-slate-50 border border-slate-100 shadow-lg focus:border-primary text-gray-900 h-40 w-72 my-2 rounded-md font-light  ${
          products.length == 0 || !handleFocus ? "hidden" : "block"
        }`}
      >
        {products.length > 0
          ? products.map((e, i) => {
              return (
                
                <div
                  ref={refContainer}
                  key={i}
                  className="hover:bg-white  w-full pl-1 cursor-pointer py-2 border-b border-gray-900 hover:text-gray-800 transition-all"
                >
                  <h1
                    className="w-full text-start transition-all hover:text-xl cursor-pointer"
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
