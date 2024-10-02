import React from "react";

function WelcomeWindow() {
  return (
    <div className=" w-full  -z-10 top-0 h-screen grid items-center absolute">
      <div className="mx-10">
        <h1 className="md:text-9xl text-5xl font-bold">Bienvenido</h1>
        <h1 className="md:text-6xl text-4xl font-bold">
          Al sistema de inventario
        </h1>
        <h1 className="md:text-6xl text-4xl font-bold text-primary">ROCHI</h1>
      </div>
    </div>
  );
}

export default WelcomeWindow;
