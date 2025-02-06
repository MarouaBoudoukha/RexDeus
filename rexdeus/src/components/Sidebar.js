import React from 'react';
import { Link } from "react-router-dom";
import '@coreui/coreui/dist/css/coreui.min.css'
import '../styles/Sidebar.css';
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilHome, cilWallet, cilBasket, cilAt, cilStar } from '@coreui/icons'

function Sidebar() {
  return (
    <CSidebar className="border-end" colorScheme="dark">
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>Rex Deus</CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
        <CNavTitle>Menu</CNavTitle>

        <Link to="/Home">
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilHome} />Home
          </CNavItem>
        </Link>

        <Link to="/AIAgents">
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilStar} />AI Agents
          </CNavItem>
        </Link>

        <Link to="/Plugin">
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilAt} /> Plugin
          </CNavItem>
        </Link>

        <Link to="/Inventory">
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilBasket} /> Inventory
          </CNavItem>
        </Link>

        <Link to="/Wallets">
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilWallet} /> Wallets
          </CNavItem>
        </Link>

      </CSidebarNav>
    </CSidebar>
  );
}

export default Sidebar;