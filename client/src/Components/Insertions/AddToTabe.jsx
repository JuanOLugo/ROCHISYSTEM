import React from "react";

function AddToTabe({ editandoId, label }) {
    
  return (
    <div className="md:col-span-5">
      <button
        type="submit"
        className="w-full  bg-blue-500 hover:bg-blue-600  shadow-md rounded-md text-primary-foreground py-1  px-4  hover:bg-primary-dark transition duration-300"
      >
        {editandoId !== null
          ? "Actualizar Producto"
          : label ? label : "Agregar a tabla" }
      </button>
    </div>
  );
}

export default AddToTabe;
