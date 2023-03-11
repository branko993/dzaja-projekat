import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { images } from 'theme'
import { path } from 'utils/const'
import Login from './Login'
import Signup from './Signup'
import ResetPassword from './ResetPassword'
import styles from './auth.module.scss'

const Auth = () => (
  <div className={styles.root}>
    <div className={styles.leftContainer}>
      <img src={images.logo} className={styles.logo} alt="logo" />
      <img src={images.logoNoBackground} className={styles.logo} alt="logo" />
      <h1 className={styles.header}>👋 Dobro nam došli</h1>
      <p className={styles.title}>Šta možete sa nama?</p>
      <p className={styles.description}>
        Aplikacija za praćenje prihoda i rashoda za vaš biznis!
      </p>
      <p className={styles.prompt}>Registruj se i isprobaj</p>
    </div>
    <div className={styles.rightContainer}>
      <Switch>
        <Route path={path.login}>
          <Login />
        </Route>
        <Route path={path.signup}>
          <Signup />
        </Route>
        <Route path={path.resetPassword}>
          <ResetPassword />
        </Route>
        <Redirect to={path.login} />
      </Switch>
    </div>
  </div>
)

export default Auth
