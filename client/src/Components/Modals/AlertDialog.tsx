import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from '@nextui-org/react'
import React from 'react'

function AlertDialog({state, onchangeState, message, title, onCancel, onConfirm}) {
  return (
    <Modal isOpen={state} onOpenChange={onchangeState}> 
        <ModalContent>
            <ModalHeader>{title}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
            <Button onClick={onCancel}>
                Cancelar
            </Button>
            <Button onClick={onConfirm}>
                Confirmar
            </Button>
        </ModalFooter>
        </ModalContent>
    </Modal>
  )
}

export default AlertDialog