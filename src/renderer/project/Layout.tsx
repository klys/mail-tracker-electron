import { Flex, Spacer, Box, Heading, ButtonGroup, Button } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {EmailIcon, StarIcon, PhoneIcon,SettingsIcon} from "@chakra-ui/icons"

import TrackStarter from './TrackStarter'
import TabProviders from './TabProviders'
import TabPeople from './TabPeople'

const Layout = () => {
  return(

        <Tabs isFitted variant='enclosed' >
  <Box p='2' align ='start'>
    <Heading size='md' align='start'>Mail Tracker</Heading>
  </Box>

  <Box gap='5' align='end'>
    <Button colorScheme='teal'><SettingsIcon/></Button>
  </Box>
  <TabList borderColor='gray.500'>
      <Tab><EmailIcon/> Start </Tab>
      <Tab><StarIcon/> Providers</Tab>
      <Tab><PhoneIcon/>People</Tab>
    </TabList>
  <TabPanels align='center'>
    <TabPanel>
      <p><TrackStarter/></p>
    </TabPanel>
    <TabPanel>
      <p><TabProviders/></p>
    </TabPanel>
    <TabPanel>
      <p><TabPeople/></p>
    </TabPanel>

  </TabPanels>
  </Tabs>
)
}

export default Layout;
