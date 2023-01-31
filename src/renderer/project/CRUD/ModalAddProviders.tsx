
import {useState} from 'react'

import { useDisclosure } from '@chakra-ui/react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import {Button, FormControl, Input, FormLabel} from "@chakra-ui/react"


const ModalAddProviders = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState({name:'',code:'',logo:''})

  const handleSubmit = () => {
    console.log(data)
    window.electron.ipcRenderer.invoke('db-insert-provider', data)
    onClose()

  }

  return (
    <>
      <Button colorScheme='green' onClick={onOpen}>Add</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Provider</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl>
          <FormLabel>Name</FormLabel>
          <Input type='text' borderColor='gray.500' onChange={(event) => setData({...data, name:event.target.value})}/>
        </FormControl>

        <FormControl>
        <FormLabel>Code</FormLabel>
        <Input type='text' borderColor='gray.500' onChange={(event) => setData({...data, code:event.target.value})}/>
      </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='green' onClick={handleSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ModalAddProviders;
