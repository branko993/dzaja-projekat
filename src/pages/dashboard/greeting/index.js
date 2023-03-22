import { isMobile } from 'react-device-detect'

import styles from './greeting.module.scss'

const Greeting = ({ me }) => (
  <div className={styles.greetingWrapper}>
    <h3 className={styles.greeting}>{`Hi👋, ${me?.fullName || 'User'}`}</h3>
    <div
      style={
        isMobile
          ? {
              width: '100%',
              height: '0',
              paddingBottom: '75%',
              position: 'relative',
            }
          : {
              width: '50%',
              height: '0',
              paddingBottom: '40%',
              position: 'relative',
            }
      }
    >
      <iframe
        src="https://giphy.com/embed/3ohzAvEx1AmvnJWpEc"
        width="100%"
        height="100%"
        style={{ position: 'absolute' }}
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
        title="keba kraba"
      />
    </div>
  </div>
)

Greeting.propTypes = {}
Greeting.defaultProps = {}

export default Greeting
