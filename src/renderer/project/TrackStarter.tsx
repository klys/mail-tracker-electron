import {useState} from 'react'

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Button,
  Avatar,
  Grid,
  GridItem
} from '@chakra-ui/react';


const TrackStarter = () => {
  const [data, setData] = useState({code:'',name:'', location:'',sender:'',date:'' });

  const handleSender = (ev) => {
    setData({
      ...data,
      sender:ev.target.value
    })
  }

  // Sub Component
  const ModalEmployeLookup = (props: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [peopleList, setPeopleList] = useState([]);
    const [personName, setPersonName] = useState([]);
    const handleSubmit = () => {
      onClose();
      // setLoading(Math.random())
      // setModalOpen(false)
      // setModalData({})
    };

    const handleOpenOnFocus = (ev) => {
      console.log("ev.target.value",ev.target.value)
      ev.target.blur();
      onOpen();
    }

    const closeModal = () => {
      onClose();
      // setModalOpen(false)
      // setModalData({})
    };

    const handlePeopleLookup = async (name) => {
      setPersonName(name);
      const result = await window.electron.ipcRenderer.invoke(
        'db-search-people',
        { name }
      );
      //console.log(result);
      setPeopleList(result);
    };

    const handlePeopleSelection = (name, location) => {
      setData({
        ...data,
        name:name, location:location

    });
    }

    return (
      <>
        {data.name !== '' ? (
         <FormControl>
          <FormLabel>Employee</FormLabel>
          <Grid templateColumns='repeat(2, 1fr)' gap={1}>
            <GridItem w='100%'><Input type="text" borderColor="gray.500" onClick={e => handleOpenOnFocus(e)} onFocus={e => handleOpenOnFocus(e)} value = {data.name}/></GridItem>
            <GridItem w='100%'><Avatar name={data.name} /> <p>{data.name}</p><p>{data.location}</p></GridItem>
          </Grid>
        </FormControl>
        )
        : (
        <FormControl>
          <FormLabel>Employee</FormLabel>
          <Input type="text" borderColor="gray.500" onClick={e => handleOpenOnFocus(e)} onFocus={e => handleOpenOnFocus(e)}/>
        </FormControl>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Lookup Employee</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  borderColor="gray.500"
                  onChange={(event) => handlePeopleLookup(event.target.value)}
                  value={personName}
                />
              </FormControl>
              <FormControl>
                {peopleList.map((row) => {
                  return (
                    <>
                      <Button colorScheme="teal" variant="ghost" onClick={() => handlePeopleSelection(row.name, row.location)} >
                        {row.name} - {row.location}
                      </Button>
                      <br />
                    </>
                  );
                })}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={() => closeModal()}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }; // SubComponent Modal Lookup Employee

  return (
    <>
      <FormControl>
        <FormLabel>Tracking Number</FormLabel>
        <NumberInput borderColor="gray.500">
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <ModalEmployeLookup />
      <FormControl>
        <FormLabel>Sender</FormLabel>
        <Input type="text" borderColor="gray.500" onChange={ev => handleSender(ev)} value={data.sender}/>
      </FormControl>

      <FormControl>
        <FormLabel>Carrier</FormLabel>
        <Input type="text" borderColor="gray.500" />
      </FormControl>

      <FormControl>
        <FormLabel>Date/Time</FormLabel>
        <Input type="date" borderColor="gray.500" />
      </FormControl>

      <FormControl mt="10px">
        <Button
          width="100%"
          border="2px"
          colorScheme="blue"
          variant="outline"
          onClick={}
        >
          Print Label
        </Button>
      </FormControl>
    </>
  );
};

export default TrackStarter;
