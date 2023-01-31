
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


const ModalAddPeople = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme='green' onClick={onOpen}>Add</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add People</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl>
          <FormLabel>Name</FormLabel>
          <Input type='text' borderColor='gray.500' />
        </FormControl>

        <FormControl>
        <FormLabel>Location</FormLabel>
        <Input type='text' borderColor='gray.500' />
      </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='green'>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ModalAddPeople;
