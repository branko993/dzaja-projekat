import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { firestore } from 'utils/firebase'
import { isMobile } from 'react-device-detect'
import { InputText } from 'primereact/inputtext'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import Button from 'components/Button'
import moment from 'moment'
import { Calendar } from 'primereact/calendar'
import { ProgressSpinner } from 'primereact/progressspinner'

import { calculateStatistics } from 'slices/helpers'
import { actions } from 'slices/clientBills.slice'
import Clients from '.'
import AddBillModal from '../addBillModal'
import styles from './clients.module.scss'

const ClientsWrapper = () => {
  const { me } = useSelector((state) => state.app)
  const { clientBills, isLoading } = useSelector((state) => state.clientBills)
  const [filteredBills, setFilteredBills] = useState([])
  const [filteredStatistics, setFilteredStatistics] = useState({
    paid: 0,
    leftToPay: 0,
    sumOfValues: 0,
  })
  const [search, setSearch] = useState('')

  const dispatch = useDispatch()
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const [showAddBillModal, setShowAddBillModal] = useState(false)

  const filterBills = () => {
    let filtered = []

    filtered = clientBills.filter(
      (bill) =>
        bill.name.toLowerCase().includes(search.toLowerCase()) ||
        bill.billNumber.toLowerCase().includes(search.toLowerCase()),
    )
    if (fromDate && toDate) {
      filtered = filtered.filter((bill) => {
        const billDate = moment(bill.billDate, 'DD/MM/YYYY')
        return fromDate <= billDate && billDate <= toDate
      })
    }
    setFilteredStatistics(calculateStatistics(filtered))
    setFilteredBills(filtered)
  }

  const filterBillsDebounced = AwesomeDebouncePromise((searchTerm) => {
    setSearch(searchTerm)
  }, 750)

  useEffect(() => {
    if (clientBills.length === 0) {
      dispatch(actions.fetchClientBills({ userId: me.id }))
    }
  }, [])

  useEffect(() => {
    filterBills()
  }, [clientBills, search, fromDate, toDate])

  const renterFilters = () =>
    isMobile ? (
      <>
        <div className={styles.filterMobileWrapper}>
          <div className={styles.filterWrapper}>
            <Button
              label="Resetuj datume"
              className="btn btn-light"
              onClick={() => {
                setToDate(null)
                setFromDate(null)
              }}
            />

            <Button
              label="Dodaj novi račun"
              className="btn btn-light"
              onClick={() => {
                setShowAddBillModal(true)
              }}
            />
          </div>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              autoResize={false}
              style={{ width: '100%' }}
              placeholder="Pretraga"
              onChange={({ target }) => {
                filterBillsDebounced(target.value)
              }}
            />
          </span>

          <Calendar
            id="billDate"
            name="billDate"
            value={fromDate}
            onChange={({ target }) => setFromDate(target.value)}
            showIcon
            placeholder="Od"
            dateFormat="dd/mm/yy"
          />
          <Calendar
            id="billDate"
            name="billDate"
            value={toDate}
            onChange={({ target }) => setToDate(target.value)}
            showIcon
            placeholder="Do"
            dateFormat="dd/mm/yy"
          />
        </div>
      </>
    ) : (
      <div className={styles.filterWrapper}>
        <div>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              placeholder="Pretraga"
              onChange={({ target }) => {
                filterBillsDebounced(target.value)
              }}
            />
          </span>
        </div>
        <Calendar
          id="billDate"
          name="billDate"
          value={fromDate}
          onChange={({ target }) => setFromDate(target.value)}
          showIcon
          placeholder="Od"
          dateFormat="dd/mm/yy"
        />
        <Calendar
          id="billDate"
          name="billDate"
          value={toDate}
          onChange={({ target }) => setToDate(target.value)}
          showIcon
          placeholder="Do"
          dateFormat="dd/mm/yy"
        />
        <Button
          label="Resetuj datume"
          className="btn btn-light"
          onClick={() => {
            setToDate(null)
            setFromDate(null)
          }}
        />
        <Button
          label="Dodaj novi račun"
          className="btn btn-light"
          onClick={() => {
            setShowAddBillModal(true)
          }}
        />
      </div>
    )

  const renderProgressBar = () =>
    isLoading && (
      <>
        <div className={styles.backdrop} />
        <ProgressSpinner className={styles.progressSpinner} />
      </>
    )

  return (
    <>
      {renderProgressBar()}
      <AddBillModal
        visible={showAddBillModal}
        setVisible={setShowAddBillModal}
        isClient
      />
      {renterFilters()}
      <Clients clientBills={filteredBills} statistics={filteredStatistics} />
    </>
  )
}

ClientsWrapper.propTypes = {}
ClientsWrapper.defaultProps = {}

export default ClientsWrapper
