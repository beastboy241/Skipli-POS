import React, { useState, useEffect } from 'react'

// material ui
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import UploadIcon from '@material-ui/icons/CloudUpload'
import SaveIcon from '@material-ui/icons/Save'

import { useFirebase } from '../../../components/FirebaseProvider'
import { useDocument } from 'react-firebase-hooks/firestore'

import AppPageLoading from '../../../components/AppPageLoading'
import { useSnackbar } from 'notistack'

import useStyles from './styles/edit'
import { Prompt } from 'react-router-dom'

function EditProduct({match}) {
    const classes = useStyles()
    const { firestore, storage, user } = useFirebase()
    const { enqueueSnackbar } = useSnackbar()
    const productRef = firestore.doc(`restaurant/${user.uid}/product/${match.params.productId}`)
    const productStorageRef = storage.ref(`restaurant/${user.uid}/product`)

    const [snapshot, loading] = useDocument(productRef)

    const [form, setForm ] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
    })

    const [error, setError ] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
    })

    const [isSubmitting, setSubmitting] = useState(false)
    const [isSomethingChange, setSomethingChange] = useState(false)

    useEffect(() => {
        if (snapshot) {
            setForm(currentForm => ({
                ...currentForm, ...snapshot.data()
            }));
        }
    }, [snapshot])

    const handleChange = e => {
        setForm({
            ...form, [e.target.name]: e.target.value
        })

        setError({
            ...error, [e.target.name]: ''
        })

        setSomethingChange(true)
    }

    const validate = () => {
        const newError = {...error}

        if(!form.name) {
            newError.name = "Product name is required."
        }

        if (!form.price) {
            newError.name = "Product price is required. "
        }

        if (!form.stock) {
            newError.stock = "Product stock is required. "
        }

        return newError
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors)
        } else {
            setSubmitting(true)
            try {
                await productRef.set(form, { merge: true})
                enqueueSnackbar('Product data saved successfully', {variant: 'success'})
                setSomethingChange(false)
            } catch (e) {
                enqueueSnackbar(e.message, {variant: 'error'})
            }
            setSubmitting(false)
        }

    }

    if (loading) {
        return <AppPageLoading/>
    }
    
    const handleUploadFile = async (e) => {
        const file = e.target.files[0]

        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            setError(error => ({
                ...error, photo:`This file type is not support: ${file.type}`
            }))
        } else if (file.size >= 512000) {
            setError(error => ({
                ...error,
                photo: `File size is too large! *Maximum file size 500kb`
            }))
        } else { 
            const reader = new FileReader()
            reader.onabort = () => {
                setError(error => ({
                ...error,
                photo: 'File reading process aborted!'
                }))
            }

             reader.onerror = () => {
            setError(error => ({
                ...error,
                photo: 'This file cannot be read!'
                }))
            }

            reader.onload = async () => {
                setError(error => ({
                    ...error,
                    photo: ''
                }))
                setSubmitting(true)
                try {
                    const photoExt = file.name.substring(file.name.lastIndexOf('.'))
                    const photoRef = productStorageRef.child(`${match.params.productId}${photoExt}`)
                    const photoSnapshot = await photoRef.putString(reader.result, 'data_url')
                    const photoUrl = await photoSnapshot.ref.getDownloadURL()

                    setForm(currentForm => ({
                        ...currentForm,
                        photo: photoUrl
                    }))
                    
                    setSomethingChange(true)
                } catch (e) {
                    setError(error => ({
                        ...error,
                        photo: e.message
                    }))
                }
                setSubmitting(false)
            }

            reader.readAsDataURL(file)





        }

        

       
    }

    
    
    
    
    return(
        <div>
            <Typography variant="h5"
                        componen="h1">
                Product Edit: {form.name}
            </Typography>
            <Grid   container
                    alignItems="center"
                    justify="center">

            </Grid>
            <Grid item xs={12} sm={6}>
                <form
                    id="product-form"
                    onSubmit={handleSubmit}
                    noValidate >

                    <TextField
                    id="name"
                    name="name"
                    label="Product name"
                    margin="normal"
                    fullWidth
                    required
                    value={form.name}
                    onChange={handleChange}
                    helperText={error.name}
                    error={error.name ? true : false}
                    disabled={isSubmitting}
                    />  

                    <TextField
                    id="price"
                    name="price"
                    label="Product price"
                    type="number"
                    margin="normal"
                    required
                    fullWidth
                    value={form.price}
                    onChange={handleChange}
                    helperText={error.price}
                    error={error.price ? true : false}
                    disabled={isSubmitting}
                  />
                  <TextField
                    id="stock"
                    name="stock"
                    label="Product stock"
                    type="number"
                    margin="normal"
                    required
                    fullWidth
                    value={form.stock}
                    onChange={handleChange}
                    helperText={error.stock}
                    error={error.stock ? true : false}
                    disabled={isSubmitting}
                  />
                  <TextField
                    id="description"
                    name="description"
                    label="Product description"
                    margin="normal"
                    multiline
                    rowsMax={3}
                    fullWidth
                    value={form.description}
                    onChange={handleChange}
                    helperText={error.description}
                    error={error.description ? true : false}
                    disabled={isSubmitting}
                  />  
                </form>
            </Grid>

            <Grid item xs={12} sm={6}>
            <div className={classes.uploadProductPhoto}>
                  {
                    form.photo &&  <img
                                    src={form.photo}
                                    className={classes.previewProductPhoto}
                                    alt={`Product Photo ${form.name}`}
                                  />
                  }
                  <input
                    className={classes.hideInputFile}
                    type="file"
                    id="upload-product-photo"
                    accept="image/jpeg,image/png"
                    onChange={handleUploadFile}
                  />
                  <label htmlFor="upload-product-photo">
                    <Button
                      disabled={isSubmitting}
                      variant="outlined"
                      component="span"
                    >
                      Upload Photo
                      <UploadIcon className={classes.iconRight}/>
                    </Button>
                  </label>
                  {
                    error.photo && <Typography color="error">
                                    {error.photo}
                                  </Typography>
                  }
                </div>
            </Grid>
            <Grid item xs={12}>
                <div className={classes.actionButton}>
                  <Button
                    disabled={isSubmitting || !isSomethingChange}
                    form="product-form"
                    type="submit"
                    color="primary"
                    variant="contained"
                  >
                    <SaveIcon className={classes.iconLeft} />
                    Save
                  </Button>
                </div>
            </Grid>
            <Prompt
              when={isSomethingChange}
              message="There are unsaved changes, do you want go ahead?"
            />
        </div>
    );
}



export default EditProduct;