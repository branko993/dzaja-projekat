import React from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'
import FontIcon from 'components/FontIcon'
import { PropTypes } from 'prop-types'
import styles from './confirmEmail.module.scss'

const ConfirmEmail = ({ email, isOpen, toggle, onSubmit }) => (
  <Modal isOpen={isOpen} toggle={toggle} size="md" centered>
    <div className={styles.root}>
      <div className={styles.container}>
        <FontIcon name="envelope-open-text" className={styles.icon} />
        <h2 className={styles.title}>Potvrdite vašu e-adresu</h2>
        <p className={styles.desc}>
          Poslali smo elektronsku poštu na {'\t'}
          <a href={`mailto:${email}`}>{email}</a>
          {'\t'}
          kako bi potvrdili vašu e-adresu. Nakon što primite e-poštu, kliknite
          na link kako biste dovršili registraciju.
        </p>
        <Button
          label="Nazad na prijavu"
          className={`btn-pink-fill ${styles.backButton}`}
          onClick={onSubmit}
        />
      </div>
    </div>
  </Modal>
)

ConfirmEmail.propTypes = {
  email: PropTypes.string,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onSubmit: PropTypes.func,
}

ConfirmEmail.defaultProps = {
  email: '',
  isOpen: false,
  toggle: () => null,
  onSubmit: () => null,
}

export default ConfirmEmail
