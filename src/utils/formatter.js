import numeral from 'numeral'

// rupiah / indonesia (id)
numeral.register('locale', 'id', {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand:'k',
    million:'m',
    billion:'b',
    trillion:'t',
  },
  currency: {
    symbol: '$'
  }
})

numeral.locale('id')

export const currency = (number) => {
  return numeral(number).format('$0,0');
}