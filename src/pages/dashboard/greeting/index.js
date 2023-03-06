import { useDispatch } from 'react-redux'
import { actions } from 'slices/app.slice'
import { images } from 'theme'

import Button from 'components/Button'
import styles from './greeting.module.scss'

const Greeting = ({ me, toggleDrawer }) => {
  const dispatch = useDispatch()

  return (
    <>
      <img src={images.logo} className={styles.logo} alt="logo" />
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
    </>
  )
}

Greeting.propTypes = {}
Greeting.defaultProps = {}

export default Greeting
