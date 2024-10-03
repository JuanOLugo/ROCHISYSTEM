import { useEffect, useState } from 'react'
import { Table, TableHeader, TableColumn, Card, CardBody,  TableBody, TableRow, TableCell, Button, Input, useDisclosure} from "@nextui-org/react"
import { format } from 'date-fns';
import { DeleteInvoiceAPI, GetInvoiceAPI } from '../../Controllers/Invoice.controller';
import Invoice from '../Modals/Invoice';



export default function SeeSells() {
  const date = new Date();
  const formattedDate = format(date, 'yyyy-MM-dd');
  const [facturas, setFacturas] = useState([])
  const [filtro, setFiltro] = useState(formattedDate)
  const [invoiceToSee, setinvoiceToSee] = useState([])
  useEffect(() => {
    const data = new Promise((res, rej) => {
     const data =  GetInvoiceAPI({date:filtro})
     if(data){
      res(data)
     }else rej()
    })

    data.then(data => setFacturas(data.data.invoices))
  }, [filtro])
  

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const totalVentas = facturas.reduce((sum, factura) => sum + factura.totalInvoice, 0)
  const totalNequi = facturas
    .filter(factura => factura.payMethod === 'Nequi')
    .reduce((sum, factura) => sum + factura.totalInvoice, 0)

  const eliminarFactura = (id) => {
    const promt = prompt("Contraseña")
    if(promt == "123"){
      const response = DeleteInvoiceAPI({id})
      setFacturas(facturas.filter(factura => factura._id !== id))
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Input type='date' label="Filtrar por fecha"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-4 w-52"/>
      <Table aria-label="Tabla de Facturas" className='h-96'>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>FECHA</TableColumn>
          <TableColumn>VENDEDOR</TableColumn>
          <TableColumn>TOTAL</TableColumn>
          <TableColumn>MÉTODO DE PAGO</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody >
          {facturas.map((factura) => (
            <TableRow key={factura._id}>
              <TableCell>{factura._id}</TableCell>
              <TableCell>{factura.date}</TableCell>
              <TableCell>{factura.sellerName}</TableCell>
              <TableCell>${factura.totalInvoice.toLocaleString("es-CO")}</TableCell>
              <TableCell>{factura.payMethod}</TableCell>
              <TableCell >
                <Button color="danger" auto className='mx-2' onClick={() => eliminarFactura(factura._id)}>
                  Anular
                </Button>
                <Button color="primary" auto onClick={() => {
                  setinvoiceToSee(factura)
                  onOpen()
                }}>
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Card className="mt-4">
        <CardBody>
          <h1>Total de Ventas: ${totalVentas.toLocaleString("es-co")}</h1>
          <h1>Total de Ventas por Nequi: ${totalNequi.toLocaleString("es-co")}</h1>
        </CardBody>
      </Card>
      <Invoice isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} data={invoiceToSee} setData={setinvoiceToSee}/>
    </div>
  )
}