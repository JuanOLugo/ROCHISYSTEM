import { useState, useCallback, useEffect } from "react";
import {
  DeleteProductAPI,
  GETPRODUCTBYSECTION,
} from "../../Controllers/Product.controller";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import TableProducts from "../Insertions/TableProducts";

export default function ListProduct() {
  const [products, setProducts] = useState([]);
  const [codeFilter, setcodeFilter] = useState("");
  const [nameFilter, setnameFilter] = useState("");
  const [productspaginate, setproductspaginate] = useState([]);
  const [pageNum, setpageNum] = useState(1);
  const [pageSize, setpageSize] = useState(10);
  const [totalPages, settotalPages] = useState(0);
  const [errorPagination, seterrorPagination] = useState(false);
  const handleDelete = useCallback(async (id) => {
    DeleteProductAPI({ id });
    setProducts((products) => products.filter((product) => product._id !== id));
    setproductspaginate((products) =>
      products.filter((product) => product._id !== id)
    );
  }, []);

  useEffect(() => {
    if (codeFilter.length > 0) {
      try {
        GETPRODUCTBYSECTION({ pageNum: 1, pageSize, codeFilter }).then((res) =>
          setproductspaginate(res.data.products)
        );
      } catch (error) {
        GETPRODUCTBYSECTION({ pageNum, pageSize }).then((res) =>
          setproductspaginate(res.data.products)
        );
      }
    }

    if (nameFilter.length > 0) {
      try {
        GETPRODUCTBYSECTION({ pageNum: 1, pageSize, nameFilter }).then((res) =>
          setproductspaginate(res.data.products)
        );
      } catch (error) {
        GETPRODUCTBYSECTION({ pageNum, pageSize }).then((res) =>
          setproductspaginate(res.data.products)
        );
      }
    }

    if (nameFilter.length === 0 && codeFilter.length === 0) {
      GETPRODUCTBYSECTION({ pageNum, pageSize }).then((res) => {
        const totalPagesRounded = res.data.info.productsSize / pageSize;
        setproductspaginate(res.data.products);
        settotalPages(Math.ceil(totalPagesRounded));
      });
    }
  }, [codeFilter, nameFilter]);

  //paginacion
  useEffect(() => {
    GETPRODUCTBYSECTION({ pageNum, pageSize }).then((res) => {
      seterrorPagination(false);
      setproductspaginate(res.data.products);
    });
  }, [pageNum, pageSize]);

  const handleUpPagination = () => {
    if (totalPages > pageNum) {
      setpageNum(pageNum + 1);
      setcodeFilter("");
      setnameFilter("");
    }
  };

  useEffect(() => {}, [pageNum]);

  return (
    <div className=" p-4 bg-gray-900 h-full min-h-screen">
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          clearable
          label="Filtrar por codigo"
          placeholder="Filtrar por codigo"
          value={codeFilter}
          maxLength={4}
          onChange={(e) => setcodeFilter(e.target.value)}
          className="max-w-xs text-gray-200 bg-gray-800 border px-3 py-2 border-gray-700 focus:border-primary "
        />
        <input
          clearable
          type="text"
          label="Nombre de producto"
          placeholder="Nombre de producto"
          value={nameFilter}
          onChange={(e) => setnameFilter(e.target.value)}
          className="max-w-xs text-gray-200 bg-gray-800 border px-3 py-2 border-gray-700 focus:border-primary"
        />
      </div>

      <div>
        <h1 className="text-sm font-bold text-white">
          Productos a mostrar por pagina
        </h1>
        <div className="flex py-2 my-1">
          <button
            className={`mx-1 text-sm p-1 ${
              pageSize === 10
                ? "bg-gray-500 opacity-50   rounded-md text-white font-bold"
                : "bg-gray-800    rounded-md text-white font-bold"
            }`}
            onClick={() => {
              if (products.length > 9) {
                setpageSize(10);
                setpageNum(1);
                setcodeFilter("");
                setnameFilter("");
              }
            }}
          >
            10
          </button>
          <button
            onClick={() => {
              if (products.length > 49) {
                setpageSize(50);
                setpageNum(1);
                setcodeFilter("");
                setnameFilter("");
              }
            }}
            className={`mx-1 text-sm p-1 ${
              pageSize === 50
                ? "bg-gray-500 opacity-50  rounded-md text-white font-bold"
                : "bg-gray-800    rounded-md text-white font-bold"
            }`}
          >
            50
          </button>
          <button
            onClick={() => {
              if (products.length > 50) {
                setpageSize(100);
                setpageNum(1);
                setcodeFilter("");
                setnameFilter("");
              }
            }}
            className={`mx-1 text-sm p-1 ${
              pageSize === 100
                ? "bg-gray-500 opacity-50  rounded-md text-white font-bold"
                : "bg-gray-800    rounded-md text-white font-bold"
            }`}
          >
            100
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <TableProducts
          productspaginate={productspaginate}
          handleDelete={handleDelete}
        />
      </div>
      <div className="flex justify-center items-center my-5 ">
        <button
          onClick={() => {
            if (pageNum > 1) {
              setpageNum(pageNum - 1);
              setcodeFilter("");
              setnameFilter("");
            }
          }}
          className={`${
            pageNum > 1 ? "bg-gray-800 " : "bg-gray-400 opacity-50"
          } p-2 text-white rounded-md `}
        >
          <FaChevronLeft />
        </button>
        <h1 className="mx-4 font-bold text-gray-200">{pageNum}</h1>
        <button
          className={` ${
            productspaginate.length === pageSize
              ? "bg-gray-800 "
              : "bg-gray-500 opacity-50"
          } p-2 text-white rounded-md `}
          onClick={handleUpPagination}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
