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
    console.log(products);
  }, [products]);

  useEffect(() => {

      const InputRef = refInput.current;
      console.log(InputRef);
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

  useEffect(() => {
    if (handleFocus) console.log("dentro");
    else console.log("fuera")
  }, [handleBlur]);

    return (
      <div
        ref={refContainer}
        className={`absolute overflow-y-scroll bg-blue-500 text-white h-36 w-64 my-2   ${
          products.length == 0 || !handleFocus ? "hidden" : "block"
        }`}
      >
        {products.length > 0
          ? products.map((e, i) => {
              return (
                <div
                  ref={refContainer}
                  key={i}
                  className="hover:bg-white w-full pl-1 cursor-pointer py-2 border-b hover:text-blue-500 transition-all"
                >
                  <h1
                    className="w-full text-start cursor-pointer"
                    onClick={() => {
                      console.log("a");
                      setters.setCodigo(e.code);
                      sethandleBlur(true);
                      sethandleFocus(false);
                      setproducts([]);
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
