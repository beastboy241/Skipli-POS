import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({

  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  card: {
    display: 'flex'
  },
  photo: {
    width: 150
  },
  photoPlaceholder: {
    width: 150,
    alignSelf: 'center',
    textAlign: 'center'
  },
  productDetails: {
    flex: '3 0 auto'
  },
  productActions: {
    flexDirection: 'column'
  }

}))

export default useStyles;