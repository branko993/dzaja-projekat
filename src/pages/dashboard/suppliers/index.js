import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { firestore } from 'utils/firebase'
import { isMobile } from 'react-device-detect'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import styles from './suppliers.module.scss'

const headerGroup = (
  <ColumnGroup>
    <Row>
      <Column header="Broj računa" rowSpan={2} />
      <Column header="Datum" rowSpan={2} />
      <Column header="Ime dobavljača" rowSpan={2} />
      <Column header="Uplaćeno" rowSpan={2} />
      <Column header="Preostalo" rowSpan={2} />
      <Column header="Ukupan iznos" rowSpan={2} />
    </Row>
  </ColumnGroup>
)

const footerGroup = (
  <ColumnGroup>
    <Row>
      <Column
        footer="Total:"
        colSpan={3}
        footerStyle={{ textAlign: 'right' }}
      />
      <Column footer={20} />
      <Column footer={40} />
      <Column footer={60} />
    </Row>
  </ColumnGroup>
)

const Suppliers = () => {
  const { me } = useSelector((state) => state.app)
  const [supplierBills, setSupplierBills] = useState([])

  useEffect(async () => {
    const supplierBillSnapshot = await firestore
      .collection('supplierBill')
      .where('userId', '==', me.id)
      .get()

    supplierBillSnapshot.docs.forEach(async (doc) => {
      const document = doc.data()
      const indexOfEl = supplierBills.findIndex(
        (bill) => bill.id === document.id,
      )

      if (indexOfEl === -1) {
        const supplierTransactionsSnapshot = await firestore
          .collection('transactions')
          .where('billID', '==', document.id)
          .get()

        document.paid = 0
        document.leftToPay = document.value
        supplierTransactionsSnapshot.docs.forEach((transactionDoc) => {
          const transaction = transactionDoc.data()
          document.paid += Number(transaction.value)
          document.leftToPay -= Number(transaction.value)
        })

        setSupplierBills((bills) => [...bills, document])
      }
    })
  }, [])

  return (
    <div className={isMobile ? styles.tableWrapper : 'card'}>
      <DataTable
        value={supplierBills}
        headerColumnGroup={headerGroup}
        footerColumnGroup={footerGroup}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column field="billNumber" />
        <Column field="dateOfCreation" />
        <Column field="supplierName" />
        <Column field="paid" />
        <Column field="leftToPay" />
        <Column field="value" />
      </DataTable>
    </div>
  )
}

Suppliers.propTypes = {}
Suppliers.defaultProps = {}

export default Suppliers
