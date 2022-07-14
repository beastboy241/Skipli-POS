import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex'
  },
  transactionSummary: {
    flex: '2 0 auto'
  },
  transactionActions: {
    flexDirection: 'column'
  }
}));

export default useStyles;