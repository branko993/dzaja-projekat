import React from 'react'
import Drawer from 'react-modern-drawer'
import { NavLink } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { dashboardPath } from 'utils/const'

import Button from 'components/Button'
import { images } from 'theme'
import styles from './drawer.module.scss'

const DrawerNavigation = ({ isOpen, toggleDrawer }) => {
  const activeDrawerStyle = {
    backgroundColor: `#b1bac2`,
  }

  const renderLogo = () =>
    isMobile ? (
      <div>
        <img
          src={images.logoNoBackgroundBlack}
          className={isMobile ? styles.logoSidebarMobile : styles.logoSidebar}
          alt="logo"
        />
        <Button onClick={toggleDrawer}>
          <i className={`${styles.navbarToggle} pi pi-align-justify`} />
        </Button>
      </div>
    ) : (
      <img
        src={images.logoNoBackgroundBlack}
        className={isMobile ? styles.logoSidebarMobile : styles.logoSidebar}
        alt="logo"
      />
    )

  return (
    <Drawer
      open={isOpen}
      onClose={toggleDrawer}
      direction={isMobile ? 'right' : 'left'}
      enableOverlay={isMobile}
      className={styles.drawer}
    >
      {renderLogo()}
      <NavLink
        to={dashboardPath.greeting}
        activeStyle={activeDrawerStyle}
        className={`${styles.navItem} mt-4`}
      >
        Home
      </NavLink>
      <NavLink
        to={dashboardPath.suppliers}
        activeStyle={activeDrawerStyle}
        className={styles.navItem}
      >
        Suppliers
      </NavLink>
      <NavLink
        to={dashboardPath.customers}
        activeStyle={activeDrawerStyle}
        className={styles.navItem}
      >
        Customers
      </NavLink>
    </Drawer>
  )
}

DrawerNavigation.propTypes = {}
DrawerNavigation.defaultProps = {}

export default DrawerNavigation
