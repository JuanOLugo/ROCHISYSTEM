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
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { CreateInvoiceAPI } from "../../Controllers/Invoice.controller";
function FinishInvoice({ isOpen, onOpen, onOpenChange, data, setProductos, setDiscount }) {
  const ref = useRef();

  useEffect(() => {
    if (isOpen) {
      ref.current.focus();
    }
  }, [isOpen]);

  const [ClientMoney, setClientMoney] = useState(0);
  const [onButtonHandler, setonButtonHandler] = useState(true);
  const [NequiValue, setNequiValue] = useState(null)

  const calculateChange = () => {
    const Change = parseInt(ClientMoney) - data.total;
    return Change;
  };


  const [PayMethod, setPayMethod] = useState("Efectivo");
  const GuardarFactura = async (e, onclose) => {
    if (ClientMoney > 0) {
      data.totalMoney = parseInt(ClientMoney);
      data.paymentMethod = PayMethod;
      data = { ...data, nequiTotal: NequiValue }
      Promise.all(setTimeout(() => {
        setonButtonHandler(true)
        onclose();
      }, 500))
      try {
        await CreateInvoiceAPI({ invoice: data })
        toast.success('Factura Creada ✅', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } catch (error) {
        toast.error('error.message', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      setPayMethod("Efectivo");

      
      setClientMoney(0);
      setProductos([]);
      setDiscount("")

    }
  };

  return (
    <div>
      <ToastContainer containerId={1} />
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
                <input
                  ref={ref}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setClientMoney(0);
                    } else {
                      setClientMoney(e.target.value);
                    }
                  }}
                  type="number"
                  min={0}
                  label="Total cliente"
                  placeholder="Cantidad dada por el cliente"
                  color="default"
                  size="lg"
                  className="font-bold py-2 rounded-lg px-2 text-xl border border-black text-black"
                />
                <h1
                  className={`text-xl  text-black font-bold py-2 px-1 border border-black rounded-xl ${calculateChange() <= -1 ? " bg-red-500" : " bg-green-500"
                    }`}
                >
                  Devuelta: ${calculateChange().toLocaleString("es-co")}
                </h1>
                <select
                  name=""
                  id=""
                  value={PayMethod}
                  onChange={(e) => {
                    setPayMethod(e.target.value)
                    if (e.target.value == "Nequi") {
                      setNequiValue(data.total)
                    }
                  }}
                  className="border border-black py-2 px-1 rounded-md"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Nequi">Nequi</option>
                </select>

                {
                  PayMethod == "Nequi" ? <>

                    <h1>Cantidad Nequi</h1>
                    <input
                      onChange={(e) => {

                        if (e.target.value == "0") {
                          setPayMethod("Efectivo")
                        } else {
                          setNequiValue(parseInt(e.target.value))
                        }
                      }}
                      type="number"
                      min={0}
                      label="Total cliente"
                      value={NequiValue}
                      placeholder="Cantidad dada por el cliente"
                      color="default"
                      size="lg"
                      className="font-bold py-2 rounded-lg px-2 text-xl border border-black text-black"
                    />

                  </> : null
                }

              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setClientMoney(0);
                    setPayMethod("Efectivo");
                    onClose();
                  }}
                >
                  Cerrar
                </Button>
                <Button disabled={onButtonHandler} onPress={(e) => {
                  setonButtonHandler(true)
                  GuardarFactura(e, onClose);

                }} color="primary">Guardar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default FinishInvoice;
