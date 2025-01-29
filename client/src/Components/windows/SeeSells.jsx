import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  Card,
  CardBody,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";

import { FaEye, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import {
  DeleteInvoiceAPI,
  GetInvoiceAPI,
  VERIFYTOTALWINDAY,
} from "../../Controllers/Invoice.controller";
import Invoice from "../Modals/Invoice";
import FinantialResume from "../Insertions/FinantialResume";
import InputDate from "../Insertions/InputDate";

export default function SeeSells() {
  const date = new Date();
  const formattedDate = format(date, "yyyy-MM-dd");
  const [facturas, setFacturas] = useState([]);
  const [filtro, setFiltro] = useState(formattedDate);
  const [invoiceToSee, setinvoiceToSee] = useState([]);
  const [totalWinDay, settotalWinDay] = useState(0);
  useEffect(() => {
    const data = GetInvoiceAPI({ date: filtro });
    const totalWinning = VERIFYTOTALWINDAY({ date: filtro });

    data
      .then((data) => setFacturas(data.data.invoices))
      .catch((err) => {
        throw new Error("Recuerda que: " + err.response.data.message);
      });

    totalWinning
      .then((data) => settotalWinDay(data.data.totalWinning))
      .catch((err) => {
        throw new Error("Recuerda que: " + err.response.data.message);
      });
  }, [filtro]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const totalVentas = facturas.reduce(
    (sum, factura) => sum + factura.totalInvoice,
    0
  );
  const totalNequi = facturas
    .filter((factura) => factura.payMethod === "Nequi")
    .reduce((sum, factura) => {
      if (factura.totalNequi) {
        return sum + factura.totalNequi; // Suma totalNequi si existe
      } else {
        return sum + factura.totalInvoice; // Suma totalInvoice si totalNequi no existe
      }
    }, 0);

  const eliminarFactura = (id) => {
    const promt = prompt("Contraseña");
    if (promt == "123") {
      const response = DeleteInvoiceAPI({ id });
      setFacturas(facturas.filter((factura) => factura._id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4 font-bold min-h-screen ">
      <InputDate
        label={"Fecha de facturas"}
        onChange={setFiltro}
        value={filtro}
      />
      <div className="h-96 overflow-y-scroll ">
        <table className="min-w-full bg-gray-800 border border-gray-700  ">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Vendedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Metodo de pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700  ">
            {facturas.map((factura) => (
              <tr key={factura._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                  {factura._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {factura.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {factura.sellerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-200">
                  ${factura.totalInvoice.toLocaleString("es-CO")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-bold">
                  {factura.payMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  <button
                    onClick={() => eliminarFactura(factura._id)}
                    className="text-red-500 hover:text-red-700 mr-2"
                  >
                    <FaTrashAlt className="text-xl" />
                  </button>

                  <button
                    onClick={() => {
                      setinvoiceToSee(factura);
                      onOpen();
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEye className="text-xl" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <FinantialResume
          totalSales={totalVentas}
          totalNequiPayments={totalNequi}
          totalProfit={totalWinDay}
        />
        <Invoice
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          data={invoiceToSee}
          setData={setinvoiceToSee}
        />
      
    </div>
  );
}
