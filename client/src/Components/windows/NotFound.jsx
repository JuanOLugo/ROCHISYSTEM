import React from 'react'

function NotFound() {
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
        <h1 className='font-bold text-6xl'>Pagina no encontrada</h1>
        <h1 className='font-bold text-4xl text-red-500'>Error - 404</h1>
    </div>
  )
}

export default NotFound