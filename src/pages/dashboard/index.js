import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { dashboardPath } from 'utils/const'

import Button from 'components/Button'
import styles from './dashboard.module.scss'
import Greeting from './greeting'
import Suppliers from './suppliers'
import Customers from './customers'
import DrawerNavigation from './drawer'

const Dashboard = () => {
  const { me } = useSelector((state) => state.app)
  const [isOpen, setIsOpen] = React.useState(!isMobile)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const { pathname } = useLocation()

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false) // Close the navigation panel
    }
  }, [pathname])

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

  return (
    <div className={styles.root}>
      <DrawerNavigation isOpen={isOpen} toggleDrawer={toggleDrawer} />
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
