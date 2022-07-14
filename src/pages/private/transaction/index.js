import React, { useState, useEffect } from 'react'

// material-ui
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Grid from '@material-ui/core/Grid'

// icons
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ViewIcon from '@material-ui/icons/Visibility'

import { useFirebase } from '../../../components/FirebaseProvider'
import { useCollection } from 'react-firebase-hooks/firestore'
import { currency } from '../../../utils/formatter'
import format from 'date-fns/format'
import AppPageLoading from '../../../components/AppPageLoading'
import { useSnackbar } from 'notistack'
import useStyles from './styles'
import DetailsDialog from './details'

function Transaction(){
    const classes = useStyles()
    const {firestore, user } = useFirebase()
    const transactionRef = firestore.collection(`restaurant/${user.uid}/transaction/`)
    const { enqueueSnackbar } = useSnackbar()
    const [snapshot,loading] = useCollection(transactionRef)
    const [transactionItems, setTransactionItems] = useState([])
    const [details, setDetails] = useState({
        open: false,
        transaction: {}
    })

    useEffect(() => {
        if (snapshot) {
            setTransactionItems(snapshot.docs)
        }
    }, [snapshot])

    /* const handleDelete = transactionDoc => async (e) => {
      if (window.confirm('Are you sure to delete this transaction?')) {
        function(querySnapshot) {
          querySnapshot.forEach(function(transactionDoc) {
            await transactionDoc.ref.delete()
          })
        }
        
      }
          
    } */
    
    const handleDelete = (id) => async e => {
      if (window.confirm('Are you sure to delete this transaction?')) {
        transactionRef.doc(id)
          .delete(() => {
            enqueueSnackbar('The transaction is deleted', {variant: 'success'})
          })

          .catch(err => {
            enqueueSnackbar(err.message, {variant: 'error'})
          }) 
      }
  

    }
    

    if (loading) {
      return <AppPageLoading/>
    }

    
    const handleCloseDetails = (e) => {
        setDetails({
          open: false,
          transaction: {}
        })
      }
      
      const handleOpenDetails = transactionDoc => e => {
        setDetails({
          open: true,
          transaction: transactionDoc.data()
        })
      }

    return(
        <>
        <Typography
                component="h1"
                variant="h5"
                paragraph
        >
      Transaction Detail
        </Typography>
        {
        transactionItems.length <= 0 && <Typography>No transaction yet</Typography>
        }
        <Grid container spacing={5}>
      {
        transactionItems.map(transactionDoc => {
          const transactionData = transactionDoc.data()
          return <Grid key={transactionDoc.id} item xs={12} sm={12} md={6} lg={4}>
            <Card className={classes.card}>
              <CardContent className={classes.transactionSummary}>
                <Typography variant="h5" noWrap>
                  No: {transactionData.no}
                </Typography>
                <Typography>
                  Total: {currency(transactionData.total)}
                </Typography>
                <Typography>
                  Date: {format(new Date(transactionData.timestamp), 'MM-dd-yyyy HH:mm')}
                </Typography>
              </CardContent>
              <CardActions className={classes.transactionActions}>
                <IconButton onClick={handleOpenDetails(transactionDoc)}><ViewIcon /></IconButton>
                <IconButton onClick={handleDelete(`${transactionDoc.id}`)}><DeleteIcon /></IconButton>
              </CardActions>
            </Card>
          </Grid>
        })
      }
    </Grid>
    <DetailsDialog
      open={details.open}
      handleClose={handleCloseDetails}
      transaction={details.transaction}
    />
        </>
    );
}

export default Transaction;