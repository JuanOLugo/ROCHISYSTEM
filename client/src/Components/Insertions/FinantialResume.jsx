import React from 'react'
import { FaDollarSign, FaMobileAlt, FaChartLine } from "react-icons/fa"
import Finantialcard from './Finantialcard'
function FinantialResume({ totalSales, totalNequiPayments, totalProfit }) {
  return (
    <section className="p-6 bg-blue-500 rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">Resumen Financiero</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Finantialcard title="Total de Ventas" amount={totalSales} icon={<FaDollarSign />} />
        <Finantialcard title="Pagos por Nequi" amount={totalNequiPayments} icon={<FaMobileAlt />} />
        <Finantialcard title="Ganancias Totales" amount={totalProfit} icon={<FaChartLine />} />
      </div>
    </section>
  )
}

export default FinantialResume