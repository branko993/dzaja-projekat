import { NavLink } from 'react-router-dom'
import { dashboardPath } from 'utils/const'
import { useDispatch } from 'react-redux'

import Button from 'components/Button'
import { actions } from 'slices/app.slice'
import { images } from 'theme'
import styles from './webDrawer.module.scss'

const WebDrawer = () => {
  const dispatch = useDispatch()

  const activeDrawerStyle = {
    backgroundColor: `#b1bac2`,
  }

  return (
    <div className={styles.drawer}>
      <img
        src={images.logoNoBackgroundBlack}
        className={styles.logoSidebar}
        alt="logo"
      />
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
        to={dashboardPath.clients}
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
    </div>
  )
}

WebDrawer.propTypes = {}
WebDrawer.defaultProps = {}

export default WebDrawer
