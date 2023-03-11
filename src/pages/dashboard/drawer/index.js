import React from 'react'
import Drawer from 'react-modern-drawer'
import { NavLink } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { dashboardPath } from 'utils/const'
import PropTypes from 'prop-types'

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
          className={styles.logoSidebarMobile}
          alt="logo"
        />
        <Button onClick={toggleDrawer}>
          <i className={`${styles.navbarToggle} pi pi-align-justify`} />
        </Button>
      </div>
    ) : (
      <img
        src={images.logoNoBackgroundBlack}
        className={styles.logoSidebar}
        alt="logo"
      />
    )

  return (
    <Drawer
      style={{ backgroundColor: 'white' }}
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

DrawerNavigation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
}
DrawerNavigation.defaultProps = {}

export default DrawerNavigation
