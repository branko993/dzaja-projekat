import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Drawer from 'react-modern-drawer'
import { Link } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

import Button from 'components/Button'
import { actions } from 'slices/app.slice'
import { images } from 'theme'
import styles from './dashboard.module.scss'

const Dashboard = () => {
  const dispatch = useDispatch()
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
          className={styles.logoSidebar}
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
    <div className={styles.root}>
      <div className={styles.container}>
        <Drawer
          open={isOpen}
          onClose={toggleDrawer}
          direction={isMobile ? 'right' : 'left'}
          enableOverlay={false}
        >
          {renderLogo()}
          <Link to="messages">
            <Button
              label="Messages"
              className={
                isMobile
                  ? 'btn-black-square-fill btn-block mt-5'
                  : 'btn-black-no-border btn-block mt-5'
              }
            />
          </Link>
          <Link to="messages">
            <Button
              label="Messages"
              className={
                isMobile
                  ? 'btn-black-square-fill btn-block'
                  : 'btn-black-no-border btn-block'
              }
            />
          </Link>
          <Link to="messages">
            <Button
              label="Messages"
              className={
                isMobile
                  ? 'btn-black-square-fill btn-block'
                  : 'btn-black-no-border btn-block'
              }
            />
          </Link>
        </Drawer>
        <img src={images.logo} className={styles.logo} alt="logo" />
        {renderToggleButton()}

        <h3 className={styles.greeting}>{`Hi👋, ${me?.fullName || 'User'}`}</h3>
        <h1 className={styles.title}>React + Firebase Boilerplate</h1>
        <div className={styles.buttonContainer}>
          <Button
            label="Download for free"
            className={`btn-purple-fill ${styles.download}`}
            onClick={toggleDrawer}
          />
          <Button
            label="Logout"
            className={`btn-purple-outline ${styles.logout}`}
            onClick={() => dispatch(actions.logout())}
          />
        </div>
      </div>
    </div>
  )
}

Dashboard.propTypes = {}
Dashboard.defaultProps = {}

export default Dashboard
