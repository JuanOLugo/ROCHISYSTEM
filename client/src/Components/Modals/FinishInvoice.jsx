import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { CreateInvoiceAPI } from "../../Controllers/Invoice.controller";
function FinishInvoice({ isOpen, onOpen, onOpenChange, data, setProductos }) {
  const ref = useRef();

  useEffect(() => {
    if (isOpen) {
      ref.current.focus();
    }
  }, [isOpen]);

  const [ClientMoney, setClientMoney] = useState(0);

  const calculateChange = () => {
    const Change = parseInt(ClientMoney) - data.total;
    return Change;
  };
  const [PayMethod, setPayMethod] = useState("Efectivo");
  const GuardarFactura = async (onclose) => {
    if (ClientMoney > 0) {
      data.totalMoney = parseInt(ClientMoney);
      data.paymentMethod = PayMethod;
      setClientMoney(0)
      setPayMethod("Efectivo")
      const response = await CreateInvoiceAPI({ invoice: data });
      setProductos([]);
      onclose()
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Finalizar factura
              </ModalHeader>
              <ModalBody className="font-bold">
                <h1 className="text-2xl font-bold">
                  Total: ${data.total.toLocaleString("es-CO")}
                </h1>
                <Input
                  ref={ref}
                  onChange={(e) => {
                    if(e.target.value === ""){
                      setClientMoney(0)
                    }else{
                      setClientMoney(e.target.value)
                    }
                  }}
                  type="number"
                  min={0}
                  label="Total cliente"
                  placeholder="Cantidad dada por el cliente"
                  color="primary"
                  size="lg"
                  className="font-bold "
                />
                <h1
                  className={`text-xl font-bold py-2 px-1 border border-black rounded-xl ${
                    calculateChange() <= -1 ? "text-white bg-red-500" : "text-white bg-green-500"
                  }`}
                >
                  Devuelta: ${calculateChange().toLocaleString("es-co")}
                </h1>
                <select
                  name=""
                  id=""
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="border border-black py-2 px-1 rounded-md"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Nequi">Nequi</option>
                </select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={() => {
                  setClientMoney(0)
                  setPayMethod("Efectivo")
                  onClose()
                }}>
                  Cerrar
                </Button>

                <Button
                  color="primary"
                  onPress={() => {
                    GuardarFactura(onClose);
                  }}
                >
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
