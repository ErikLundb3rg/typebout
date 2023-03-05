import React from 'react'
import { Box } from '@chakra-ui/react'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'

interface MenuToggleProps {
  toggle: () => void
  isOpen: boolean
}
const MenuToggle = ({ toggle, isOpen }: MenuToggleProps) => {
  return (
    <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
      {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
    </Box>
  )
}

export default MenuToggle
