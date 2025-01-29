import React from 'react'

function Finantialcard({ title, amount, icon }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex items-center">
    <div className="mr-4 text-4xl text-blue-500">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      <p className="text-2xl font-bold text-gray-200">${amount.toLocaleString("es-CO")}</p>
    </div>
  </div>
  )
}

export default Finantialcard