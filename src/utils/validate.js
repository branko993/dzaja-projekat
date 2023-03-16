export const tests = {
  name: {
    test: /^[a-z]+([a-z- ',.-]?)+[a-z.]+$/i,
    error: 'Please enter a valid name',
  },
  email: {
    test: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    error: 'Unesite dobru e-adresu.',
  },
  password: {
    test: /(?=^.{6,}$)(?=.*\d)(?=.*[a-z]).*$/,
    error:
      'Lozinka mora da ima bar šest karaktera i mora da sadrži jedan broj.',
  },
  phone: {
    test: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    error: 'Please enter a valid phone number.',
  },
}

export const addTransactionTests = {
  transactionDate: {
    test: /\S/,
    error: 'Datum je obavezan',
  },
  value: {
    test: /^\d*[1-9]\d*$/,
    error: 'Iznos mora biti pozitivan broj',
  },
}

export const addBillTest = {
  billNumber: {
    test: /\S/,
    error: 'Broj računa je obavezan',
  },
  billDate: {
    test: /\S/,
    error: 'Datum je obavezan',
  },
  name: {
    test: /\S/,
    error: 'Ovo polje je obavezano',
  },
  value: {
    test: /^\d*[1-9]\d*$/,
    error: 'Iznos mora biti pozitivan broj',
  },
}

const validate = (vs, ts) => {
  const errors = {}
  let isError = false
  Object.keys(vs).forEach((key) => {
    if (ts[key]) {
      const { test, error, options = {} } = ts[key]
      if (test && error) {
        const res =
          typeof test === 'function' ? test(vs[key]) : test.test(vs[key])
        const skip = options.ifNotEmpty && !vs[key].toString().length > 0
        if (!res && !skip) {
          isError = true
          errors[key] = error
        }
      }
    }
  })
  return { isError, errors }
}

export default validate
