import React from 'react'
import { useSelector } from 'react-redux'
import Drawer from 'react-modern-drawer'
import { Link, Switch, Route, Redirect } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { dashboardPath } from 'utils/const'

import Button from 'components/Button'
import { images } from 'theme'
import styles from './dashboard.module.scss'
import Greeting from './greeting'
import Suppliers from './suppliers'
import Customers from './customers'

const Dashboard = () => {
  const { me } = useSelector((state) => state.app)
  const [isOpen, setIsOpen] = React.useState(!isMobile)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const renderToggleButton = () =>
    isMobile ? (
      <Button onClick={toggleDrawer}>
        <i
          className={`${
            isMobile ? styles.menuToggleRight : styles.menuToggleLeft
          } pi pi-align-justify`}
        />
      </Button>
    ) : (
      <></>
    )

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
    <div className={styles.root}>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction={isMobile ? 'right' : 'left'}
        enableOverlay={false}
      >
        {renderLogo()}
        <Link to={dashboardPath.greeting}>
          <Button
            label="Home"
            className={
              isMobile
                ? 'btn-black-square-fill btn-block mt-5'
                : 'btn-black-no-border btn-block mt-5'
            }
          />
        </Link>
        <Link to={dashboardPath.suppliers}>
          <Button
            label="Suppliers"
            className={
              isMobile
                ? 'btn-black-square-fill btn-block'
                : 'btn-black-no-border btn-block'
            }
          />
        </Link>
        <Link to={dashboardPath.customers}>
          <Button
            label="Customers"
            className={
              isMobile
                ? 'btn-black-square-fill btn-block'
                : 'btn-black-no-border btn-block'
            }
          />
        </Link>
      </Drawer>
      {renderToggleButton()}
      <div className={styles.container}>
        <Switch>
          <Route path={dashboardPath.greeting}>
            <Greeting me={me} toggleDrawer={toggleDrawer} />
          </Route>
          <Route path={dashboardPath.suppliers}>
            <Suppliers />
          </Route>
          <Route path={dashboardPath.customers}>
            <Customers />
          </Route>
          <Redirect
            to={dashboardPath.greeting}
            me={me}
            toggleDrawer={toggleDrawer}
          />
        </Switch>
      </div>
    </div>
  )
}

Dashboard.propTypes = {}
Dashboard.defaultProps = {}

export default Dashboard
