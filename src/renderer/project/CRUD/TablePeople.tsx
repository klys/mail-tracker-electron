

//const electron = window.require('electron');
import {useState, useEffect} from 'react'

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  ButtonGroup,
  Avatar
} from '@chakra-ui/react'

//import ModalAddProviders from "./ModalAddProviders"

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



const TableProviders = () => {

  const [mode, setMode] = useState('standard');
  const [values, setValues] = useState([]);
  const [deletable, setDeletable] = useState(false);
  const [loading, setLoading] = useState(0);
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleDeletable = () => {
    setDeletable(!deletable);
    if (mode !== 'deleting') setMode('deleting')
    else setMode('standard')
  }

  const ButtonGroupSwitch = () => {
    switch(mode) {
      case 'standard':
      return (
  <ButtonGroup variant='outline' spacing='6'>
      <ModalAdd data={modalData} isOpen={isModalOpen}/>
      <Button colorScheme='blue'>Filter</Button>
      <Button colorScheme='red' onClick={toggleDeletable}>Remove</Button>
  </ButtonGroup>
  )
    case 'deleting':
      return (
    <ButtonGroup variant='outline' spacing='6'>
        <Button colorScheme='black' onClick={toggleDeletable}>Done</Button>
    </ButtonGroup>
      )
    }
  }

  const ModalAdd = (props:any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState({name:'',location:'',photo:'', email:''})
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

  useEffect(() => {
    if (props.data) {
      console.log(props.data)
      setData(props.data)
    }

  },[props])

    const handleSubmit = () => {
      console.log(data)
      if (data.id !== undefined) {
        // in case of edit
        window.electron.ipcRenderer.invoke('db-update-people', data)
      } else {
        // in case of new element
        window.electron.ipcRenderer.invoke('db-insert-people', data)
      }

      onClose()
      setLoading(Math.random())
      setModalOpen(false)
      setModalData({})
    }

    const closeModal = () => {
      setData({name:'', location: '', photo:'', email:''})
      onClose()
      setModalOpen(false)
      setModalData({})
    }

    return (
      <>
        <Button colorScheme='green' onClick={onOpen}>Add</Button>

        <Modal isOpen={(props.isOpen || isOpen) ? true : false} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Provider</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <FormControl>
            <FormLabel>Name</FormLabel>
            <Input type='text' borderColor='gray.500' onChange={(event) => setData({...data, name:event.target.value})} value={data.name}/>
          </FormControl>

          <FormControl>
          <FormLabel>Location</FormLabel>
          <Input type='text' borderColor='gray.500' onChange={(event) => setData({...data, location:event.target.value})} value={data.location}/>
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type='text' borderColor='gray.500' onChange={(event) => setData({...data, email:event.target.value})} value={data.email}/>
        </FormControl>
        <FormControl>
          <FormLabel>Photo</FormLabel>
          <Input type='file' onChange={onSelectFile} />
            {selectedFile &&  <img src={preview} /> }
        </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={() => closeModal()}>
                Cancel
              </Button>
              <Button colorScheme='green' onClick={handleSubmit}>Submit</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  } // ModalAdd

  const dbDeleteElement = (id) => {
    window.electron.ipcRenderer.invoke('db-delete-poeple', {id:id})
    setLoading(Math.random())
  }

  const dbSelectProviders = () => {
    const data = window.electron.ipcRenderer.invoke("db-select-peoples");

    data.then(x => setValues(x));
  }


  useEffect(() => {

    dbSelectProviders();

  },[loading])

  const modalOpenEditor = (editData) => {
    setModalOpen(true)
    setModalData(editData)
  }

  return(<>
  {ButtonGroupSwitch()}

    <TableContainer>
  <Table variant='striped' colorScheme='teal'>
    <TableCaption>
    <ButtonGroup variant='outline' spacing='6' isAttached >
      <Button colorScheme='red'>1</Button>
      <Button colorScheme='green'>2</Button>
      <Button colorScheme='green'>3</Button>
    </ButtonGroup>
    </TableCaption>
    <Thead>
      <Tr>
        <Th>Location</Th>
        <Th>Name</Th>
        <Th>Photo</Th>
      </Tr>
    </Thead>
    <Tbody>
      {values.map((row) => {
        return(<Tr >
          <Td>{row['location']}</Td>
          <Td onClick={() => modalOpenEditor({id:row['id'], name: row['name'], location: row['location'], email: row['email']})}>{row['name']}</Td>
          <Td><Avatar bg='blue.500' /></Td>
          {(deletable) ? <Td><Button colorScheme='red' onClick={() => dbDeleteElement(row['id'])}>Delete</Button></Td> : null}
        </Tr>)
      })}

    </Tbody>
    <Tfoot>
      <Tr>
        <Th>Code</Th>
        <Th>Name</Th>
        <Th>Photo</Th>
      </Tr>
    </Tfoot>
  </Table>
</TableContainer>
</>)
}



export default TableProviders;
