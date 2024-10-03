import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
function Invoice({ isOpen, onOpen, onOpenChange, data, setData }) {
  const { productList, totalInvoice } = data;

  return (
    <Modal isOpen={isOpen} size="4xl" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Factura
            </ModalHeader>
            <ModalBody>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>Codigo</TableColumn>
                  <TableColumn>Nombre</TableColumn>
                  <TableColumn>Precio</TableColumn>
                  <TableColumn>Descuento</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                </TableHeader>
                <TableBody>
                  {productList.map((e, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell className="border border-blue-500  ">{e.code}</TableCell>
                        <TableCell className="border border-blue-500  ">{e.name}</TableCell>
                        <TableCell className="border border-blue-500  ">{e.priceSell.toLocaleString("es-CO")}</TableCell>
                        <TableCell className="border border-blue-500  ">%{e.discount}</TableCell>
                        <TableCell className="border border-blue-500  ">{e.amount}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <h1 className="font-bold text-2xl">Total: ${totalInvoice.toLocaleString("es-CO")}</h1>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
               Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default Invoice;
