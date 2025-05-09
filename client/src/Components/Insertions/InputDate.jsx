import React from 'react'

function InputDate({value, label, onChange}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white-800 border border-blue-500 rounded-md text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

export default InputDate