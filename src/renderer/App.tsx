import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'

import Index from './project/Layout'

import icon from '../../assets/icon.svg';


export default function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
