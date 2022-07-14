import React, { useState, useEffect } from 'react'

// material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './styles/restaurant'

// validator
import isURL from 'validator/lib/isURL';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';

import { useDocument } from 'react-firebase-hooks/firestore'

import AppLoading from '../../../components/AppPageLoading'
import { Prompt } from 'react-router-dom'





function Restaurant(){
    const classes = useStyles();
    const { firestore, user} = useFirebase();
    const restaurantDoc = firestore.doc(`restaurant/${user.uid}`);
    const [snapshot, loading] = useDocument(restaurantDoc);
    const { enqueueSnackbar } = useSnackbar();

    const [ form, setForm ] = useState({
        name: '',
        address: '',
        phone: '',
        website: ''

    })

    const [ error, setError ] = useState({
        name: '',
        address: '',
        phone: '',
        website: ''

    })

    const [ isSubmitting, setSubmitting ] = useState(false)
    const [ isSomethingChange, setSomethingChange] = useState(false)

    useEffect(() => {
        if (snapshot) {
            setForm(snapshot.data())
        }
    }, [snapshot])

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value
        })
        setError({
            [e.target.name]: ''
        })

        setSomethingChange(true)
    }

    const validate = () => {
        const newError = {...error};
        if (!form.name) {
            newError.name = "This name does not exist"
        }   
        if (!form.address) {
            newError.address = "Address is not valid"
        }
        if (!form.phone) {
            newError.phone = "This phone does not exist"
        }   
        if (!form.website) {
            newError.website = "This website does not exist"
        } else if (!isURL(form.website)) {
            newError.website = "Website is invalid"
        }

        return newError

    }

    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors)
        } else {
            setSubmitting(true)
            try {
                await restaurantDoc.set(form, {merge: true});
                setSubmitting(false)
                enqueueSnackbar('Data saved successfully!', {variant: 'success'})
            } catch (e) {
                console.log(e.message)
                enqueueSnackbar(e.message, {variant: 'error'})
            }
            setSubmitting(false)
        }
    }

    if (loading) {
        return <AppLoading/>
    }

    return <div className={classes.userRestaurant}>
        <form onSubmit={handleSubmit} noValidate>
            <TextField
                id="name"
                name="name"
                label="Restaurant name"
                margin="normal"
                required
                fullWidth
                value={form.name}
                onChange={handleChange}
                error={error.name ? true: false}
                helperText = {error.name}
                disabled={isSubmitting}/>
            <TextField
            id="address"
            name="address"
            label="Restaurant address"
            margin="normal"
            required
            fullWidth
            value={form.address}
            onChange={handleChange}
            error={error.address ? true : false}
            helperText={error.address}
            disabled={isSubmitting}
            />
          <TextField
            id="phone"
            name="phone"
            label="Resaurant phone number"
            margin="normal"
            required
            fullWidth
            value={form.phone}
            onChange={handleChange}
            error={error.phone ? true : false}
            helperText={error.phone}
            disabled={isSubmitting}
          />
          <TextField
            id="website"
            name="website"
            label="Website Restaurant"
            margin="normal"
            required
            fullWidth
            value={form.website}
            onChange={handleChange}
            error={error.website ? true : false}
            helperText={error.website}
            disabled={isSubmitting}
          />

        <Button
                type="submit"
                className={classes.actionButton}
                variant="contained"
                color="primary"
                disabled={isSubmitting || !isSomethingChange}
              >
                Save
        </Button>


        </form>
        <Prompt when={isSomethingChange}
            message="There are unsaved changes, are you sure you want to leave this page?" />

    </div>
}

export default Restaurant;