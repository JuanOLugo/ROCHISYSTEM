import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from "@nextui-org/react";
function FinishInvoice({ isOpen, onOpen, onOpenChange, data }) {

    useEffect(() => {
      console.log(data)
    }, [data])
    
    const ref = useRef()

    useEffect(() => {
      if(isOpen){
        ref.current.focus()
      }
    }, [isOpen])
    
    const [ClientMoney, setClientMoney] = useState(0)

    const calculateChange = () => {
        const Change = parseInt(ClientMoney) - data.total
        return Change
    }

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Finalizar factura
              </ModalHeader>
              <ModalBody>
                <h1 className="text-2xl font-bold">Total: ${data.total.toLocaleString("es-CO")}</h1>
                <Input ref={ref} onChange={e => setClientMoney(e.target.value)} type="number" label="Total cliente" placeholder="Cantidad dada por el cliente"/>
                <h1 className={`text-xl font-bold ${calculateChange() <= -1 ? "text-red-500" : "text-green-500"}`}>Devuelta: ${calculateChange().toLocaleString("es-co")}</h1>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default FinishInvoice;
