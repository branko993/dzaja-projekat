import React from 'react'
import Drawer from 'react-modern-drawer'
import { NavLink } from 'react-router-dom'
import { isMobile, isSamsungBrowser } from 'react-device-detect'
import { dashboardPath } from 'utils/const'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { actions } from 'slices/app.slice'
import Button from 'components/Button'
import { images } from 'theme'
import styles from './drawer.module.scss'

const MobileDrawerNavigation = ({ isOpen, toggleDrawer }) => {
  const dispatch = useDispatch()

  const activeDrawerStyle = {
    backgroundColor: `#b1bac2`,
  }

  const renderLogo = () =>
    isMobile ? (
      <div>
        <img
          src={
            isSamsungBrowser
              ? images.logoNoBackground
              : images.logoNoBackgroundBlack
          }
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
        Početna
      </NavLink>
      <NavLink
        to={dashboardPath.suppliers}
        activeStyle={activeDrawerStyle}
        className={styles.navItem}
      >
        Dobavljači
      </NavLink>
      <NavLink
        to={dashboardPath.customers}
        activeStyle={activeDrawerStyle}
        className={styles.navItem}
      >
        Klijenti
      </NavLink>
      <Button
        label="Logout"
        className={`${styles.navItem} ${styles.logoutButton}`}
        onClick={() => dispatch(actions.logout())}
      />
    </Drawer>
  )
}

MobileDrawerNavigation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
}
MobileDrawerNavigation.defaultProps = {}

export default MobileDrawerNavigation
