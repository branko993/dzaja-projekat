import React, { useState } from 'react'

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { isMobile } from 'react-device-detect'
import { useHistory } from 'react-router-dom'
import { Dialog } from 'primereact/dialog'

import Button from 'components/Button'
import { dashboardPath } from 'utils/const'
import { useSelector } from 'react-redux'

import styles from './suppliers.module.scss'
import AddTransactionModal from '../addTransactionModal'

const Suppliers = () => {
  const history = useHistory()
  const { supplierBills, statistics } = useSelector((state) => state.bills)

  const [currentTransactions, setCurrentTransactions] = useState([])
  const [currentBillNumber, setCurrentBillNumber] = useState('')
  const [currentBillID, setCurrentBillID] = useState('')

  const [visible, setVisible] = useState(false)
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false)

  const renderFooter = () =>
    isMobile ? (
      <Tbody>
        <Tr>
          <Th style={{ textAlign: 'left' }}>Total:</Th>
          <Th style={{ textAlign: 'right', color: 'green' }}>
            Uplaćeno: {statistics.paid}
          </Th>
          <Th style={{ textAlign: 'right', color: 'red' }}>
            Preostalo: {statistics.leftToPay}
          </Th>
          <Th style={{ textAlign: 'right' }}>
            Ukupan iznos: {statistics.sumOfValues}
          </Th>
        </Tr>
      </Tbody>
    ) : (
      <Tbody>
        <Tr>
          <Th />
          <Th />
          <Th style={{ textAlign: 'left' }}>Total:</Th>
          <Th style={{ color: 'green' }}>{statistics.paid} RSD</Th>
          <Th style={{ color: 'red' }}>{statistics.leftToPay} RSD</Th>
          <Th>{statistics.sumOfValues} RSD</Th>
          <Th />
        </Tr>
      </Tbody>
    )

  const renderTransactions = () =>
    currentTransactions.map((transaction) => (
      <Tr key={transaction.id}>
        <Td>{transaction.transactionDate}</Td>
        <Td>{transaction.value} RSD</Td>
      </Tr>
    ))

  const renderTableBody = () =>
    supplierBills.map((bill) => (
      <React.Fragment key={bill.id}>
        <Tr>
          <Td>{bill.billNumber}</Td>
          <Td>{bill.billDate}</Td>
          <Td>{bill.supplierName}</Td>
          <Td style={{ color: 'green' }}>{bill.paid} RSD</Td>
          <Td style={{ color: 'red' }}>{bill.leftToPay} RSD</Td>
          <Td>{bill.value} RSD</Td>
          <Td className={!isMobile && styles.actionsWrapper}>
            <Button
              onClick={() => {
                setCurrentBillNumber(bill.billNumber)
                setCurrentTransactions(bill.transactions)
                setVisible(true)
              }}
            >
              <span style={{ fontSize: '1.7rem' }} className="pi pi-book" />
            </Button>
            <Button
              className="ml-4"
              onClick={() => {
                setCurrentBillNumber(bill.billNumber)
                setCurrentTransactions(bill.transactions)
                setVisible(true)
              }}
            >
              <span style={{ fontSize: '1.7rem' }} className="pi pi-pencil" />
            </Button>
            <Button
              className="ml-3"
              onClick={() => {
                setCurrentBillNumber(bill.billNumber)
                setCurrentBillID(bill.id)
                setShowAddTransactionModal(true)
              }}
            >
              <span style={{ fontSize: '1.7rem' }} className="pi pi-plus" />
            </Button>
          </Td>
        </Tr>
      </React.Fragment>
    ))

  return (
    <>
      <div className={styles.buttonWrapper}>
        <Button
          label="Dodaj novi račun"
          className="btn-purple-outline"
          onClick={() => history.push(dashboardPath.addSupplier)}
        />
      </div>
      <AddTransactionModal
        visible={showAddTransactionModal}
        setVisible={setShowAddTransactionModal}
        billNumber={currentBillNumber}
        billID={currentBillID}
      />
      <Dialog
        header={`Transakcije za racun sa brojem ${currentBillNumber}`}
        visible={visible}
        style={{ width: isMobile ? '80vw' : '50vw' }}
        onHide={() => setVisible(false)}
      >
        {currentTransactions.length > 0 ? (
          <Table className={styles.table}>
            <Thead>
              <Tr>
                <Th>Datum uplate</Th>
                <Th>Količina</Th>
              </Tr>
            </Thead>
            <Tbody>{renderTransactions()}</Tbody>
          </Table>
        ) : (
          <div>Nema transakcija za ovaj račun!</div>
        )}
      </Dialog>
      <Table className={styles.table}>
        <Thead>
          <Tr>
            <Th>Broj računa</Th>
            <Th>Datum</Th>
            <Th>Ime dobavljača</Th>
            <Th>Uplaćeno</Th>
            <Th>Preostalo</Th>
            <Th>Ukupan iznos</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>{renderTableBody()}</Tbody>
        {renderFooter()}
      </Table>
    </>
  )
}

Suppliers.propTypes = {}

Suppliers.defaultProps = {}

export default Suppliers
