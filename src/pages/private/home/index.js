import React, { useState, useEffect } from 'react'

// material ui
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

// icons
import ImageIcon from '@material-ui/icons/Image';
import SaveIcon from '@material-ui/icons/Save';

import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';

import AppPageLoading from '../../../components/AppPageLoading'

import useStyles from './styles'
import { useSnackbar } from 'notistack';

import { currency } from '../../../utils/formatter'

import format from 'date-fns/format'

function Home() {

  const classes = useStyles()
  
  const {enqueueSnackbar} = useSnackbar()

  const { auth, firestore, user } = useFirebase();

  const productCol = firestore.collection(`restaurant/${user.uid}/product`)

  const transactionCol = firestore.collection(`restaurant/${user.uid}/transaction`)

  const todayDateString = format(new Date(), 'MM-dd-yyyy')

  const [snapshotTransaction, loadingTransaction] = useCollection(transactionCol.where('date','==',todayDateString))

  const [snapshotProduct, loadingProduct] = useCollection(productCol)

  const [productItems, setProductItems] = useState([])
  const [filterProduct, setFilterProduct] = useState('')

  const initTransaction = {
    no: '',
    items: {

    },
    total: 0,
    date: todayDateString
  }
  const [transaction, setTransaction] = useState(initTransaction)

  const [isSubmitting, setSubmitting] = useState(false)

  useEffect(() => {

    if (snapshotTransaction) {
      setTransaction(transaction => ({
        ...transaction,
        no: `${transaction.date}/${snapshotTransaction.docs.length+1}`
      }))
    } else {
      setTransaction(transaction => ({
        ...transaction,
        no: `${transaction.date}/1`
      }))
    }
    
  }, [snapshotTransaction])

  useEffect(() => {
    if (snapshotProduct) {
      setProductItems(snapshotProduct.docs.filter((productDoc) => {
        if (filterProduct) {
          return productDoc.data().name.toLowerCase().includes(filterProduct.toLowerCase())
        }
        return true 
      }))
    }
  }, [snapshotProduct, filterProduct])

  const addItem = productDoc => e => {
    let newItem = { ...transaction.items[productDoc.id] }
    const productData = productDoc.data()

    if (newItem.amount) {
      newItem.amount = newItem.amount + 1
      newItem.subtotal = productData.price * newItem.amount
    } else {
      newItem.amount = 1
      newItem.price = productData.price
      newItem.subtotal = productData.price
      newItem.name = productData.name
    }

    const newItems = {
      ...transaction.items,
      [productDoc.id]: newItem
    }

    if (newItem.amount > productData.stock) {
      enqueueSnackbar('Out of Stock!', {variant:'error'})
    } else {
      setTransaction({
        ...transaction,
        items: newItems,
        total: Object.keys(newItems).reduce((total,k) => {
          const item = newItems[k]
          return total + parseInt(item.subtotal)
        },0)
      })
    }

  }
 
  const removeItem = k => e => {
    let item = transaction.items[k]
    item.remove()
  }
  
  const handleChangeAmount = k => e => {
    let newItem = {...transaction.items[k]}

    newItem.amount = parseInt(e.target.value)
    newItem.subtotal = newItem.price * newItem.amount

    const newItems = {
      ...transaction.items,
      [k]: newItem
    }

    const productDoc = productItems.find(item => item.id === k)
    const productData = productDoc.data()

    if (newItem.amount > productData.stock) {
      enqueueSnackbar('Out of stock! ', {variant:'error'})
    } else {
      setTransaction({
        ...transaction,
        items: newItems,
        total: Object.keys(newItems).reduce((total,k) => {
          const item = newItems[k]
          return total + parseInt(item.subtotal)
        },0)
      })
    }

  }

  const saveTransaction = async (e) => {
    if (Object.keys(transaction.items).length <= 0) {
      enqueueSnackbar('No transaction to save!', {variant: 'error'})
      return false
    }

    setSubmitting(true)
    try {
      await transactionCol.add({
        ...transaction,
        timestamp: Date.now()
      })

     
      // https://firebase.google.com/docs/firestore/manage-data/transactions
      await firestore.runTransaction(transaction => {
        const productIDs = Object.keys(transaction.items)

        return Promise.all(productIDs.map(productId => {
          const productRef = firestore.doc(`restaurant/${user.uid}/product/${productId}`)

          return transaction.get(productRef).then((productDoc) => {
            if (!productDoc.exists) {
              throw Error('There are no product')
            }
            let newStock = parseInt(productDoc.data().stock) - parseInt(transaction.items[productId].amount)

            if (newStock < 0) {
              newStock = 0
            }
            
           
        
          
            transaction.update(productRef, {stock: newStock})
            
          })
        }))
      })


      
      enqueueSnackbar('Transaction saved successfully!', {variant: 'success'})
      setTransaction(transaction=> ({
              ...initTransaction,
              no: transaction.no,
      }))
    } catch (e) {
      enqueueSnackbar(e.message, {variant: 'error'})
    }
      setSubmitting(false)

  }  

  if (loadingProduct || loadingTransaction) {
    return <AppPageLoading />
  }

  return  <>
            <Typography variant="h5" component="h1">
              Create new transaction
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs>
                <TextField
                  label="Transaction Ticket:"
                  value={transaction.no}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveTransaction}
                  disabled={isSubmitting}
                >
                  <SaveIcon className={classes.iconLeft} />
                  Save Transaction
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={12} md={8}>
                <Table>
                  <TableHead>
                    <TableCell>Item</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableHead>
                  <TableBody>
                    { //keys(transaction.items)
                      Object.keys(transaction.items).map(k => {
                        const item = transaction.items[k]
                        return (
                          <TableRow key={k}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <TextField
                                disabled={isSubmitting}
                                className={classes.inputAmount}
                                value={item.amount}
                                type="number"
                                onChange={handleChangeAmount(k)}
                              />
                            </TableCell>
                            <TableCell>{currency(item.price)}</TableCell>
                            <TableCell>{currency(item.subtotal)}</TableCell>
                            <TableCell><Button variant="contained" color="Info" onClick={removeItem(k)}> Remove </Button></TableCell>
                          </TableRow>
                        )
                      })
                    }
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="subtitle2">
                          Total
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">
                          {currency(transaction.total)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} md={4}>
                <List
                  className={classes.productList}
                  component="nav"
                  subheader={
                    <ListSubheader component="div">
                      <TextField
                        autoFocus
                        label="Search Product"
                        fullWidth
                        margin="normal"
                        onChange={e => {
                          setFilterProduct(e.target.value)
                        }}
                      />
                    </ListSubheader>
                  }
                >
                  {
                    productItems.map((productDoc) => {
                      const productData = productDoc.data()
                      return <ListItem
                        key={productDoc.id}
                        button
                        disabled={!productData.stock || isSubmitting}
                        onClick={addItem(productDoc)}
                      >
                        {
                          productData.photo ? 
                          <ListItemAvatar>
                            <Avatar
                              src={productData.photo}
                              alt={productData.name}
                            />
                          </ListItemAvatar>
                          :
                          <ListItemIcon><ImageIcon /></ListItemIcon>
                        }
                        <ListItemText
                          primary={productData.name}
                          secondary={`Stock: ${productData.stock || 0}`}
                        />
                      </ListItem>
                    })
                  }
                </List>
              </Grid>
            </Grid>
          </>
}

export default Home;