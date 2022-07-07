import React, { useState } from 'react'
import PropTypes from 'prop-types'

// material-ui
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
//import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { useFirebase } from '../../../components/FirebaseProvider'
import { withRouter } from 'react-router-dom'

function AddDialog({history, open, handleClose }) {
  const { firestore, user } = useFirebase();
  const productConnect = firestore.collection(`restaurant/${user.uid}/product`)
  const [name, setName ] = useState('')
  const [error, setError] = useState ('')
  const [ isSubmitting, setSubmitting] = useState(false)

  const handleSubmit = async e => {
    setSubmitting(true)
    try {
      if(!name) {
        throw new Error("Product name is required!")

      }
      const newProduct = await productConnect.add({ name });
      history.push(`product/edit/${newProduct.id}`)
    } catch (e) {
      setError(e.message)
    }
    setSubmitting(false)
  }

  return (
    <Dialog disabledBackdropClick={isSubmitting}
            disabledEscapeKeyDown={isSubmitting}
            open={open}
            onClose = {handleClose}
    >
      <DialogTitle>Create new product </DialogTitle>
      <DialogContent dividers>
        <TextField 
          id="name"
          label="Product name"
          value={name}
          onChange={(e) => {
            setError('')
            setName(e.target.value);
          }}
          helperText = {error}
          error={error ? true: false}
          disabled= { isSubmitting }
        />

      </DialogContent>
      <DialogActions>
        <Button disabled= {isSubmitting}
                onclick= {handleClose}>
                  Cancel
          </Button>
        <Button disabled={isSubmitting}
                onClick={handleSubmit}
                color="primary">
                  Save
          </Button>
      </DialogActions>
    </Dialog>
  )

} 
 AddDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
  }

export default withRouter(AddDialog)