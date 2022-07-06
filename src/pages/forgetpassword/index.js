import React, { useState } from 'react';
import useStyles from './styles'
import { Container, Paper, Typography, TextField, Grid, Button } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import { useFirebase } from '../../components/FirebaseProvider';
import AppLoading from '../../components/apploading';
import { useSnackbar } from 'notistack';

function ForgetPassword() {
    const classes = useStyles();

    const [form, setForm] = useState({
        email: ''
    });

    const [isSubmitting, setSubmitting] = useState(false);

    const { auth, user, loading } = useFirebase();

    const { enqueueSnackbar } = useSnackbar();

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            ...error,
            [e.target.name]: ''
        })
    }

    const [error, setError] = useState({
        email: ''
    })

    const validate = () => {
        const newError = { ...error };
        if (!form.email) {
            newError.email = 'Email is required';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email is not valid';
        }

        return newError;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            try {
                setSubmitting(true);
                const actionCodeSettings = {
                    url: `${window.location.origin}/login`
                }
                await auth.sendPasswordResetEmail(form.email, actionCodeSettings);
                enqueueSnackbar(`Check email inbox ${form.email}, The link to reset password has been sent`, { variant: 'success' })
                setSubmitting(false);
            } catch (e) {
                const newError = {};

                switch (e.code) {
                    case 'auth/user-not-found': newError.email = 'Email not registered';
                        break;
                    case 'auth/invalid-email': newError.email = 'Email is not valid';
                        break;
                    default:
                        newError.email = 'An error occurred please try again';
                        break;
                }

                setError(newError);
                setSubmitting(false);
            }
        }
    }

    if (loading) {
        return <AppLoading />
    }

    if (user) {
        return <Redirect to="/" />
    }

    return (
        <Container maxWidth="xs">
            <Paper className={classes.paper}>
                <Typography variant="h5" component="h1" className={classes.title}>
                Forget Password?
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        margin="normal"
                        label="New Email"
                        fullWidth
                        required
                        value={form.email}
                        onChange={handleChange}
                        helperText={error.email}
                        error={error.email ? true : false}
                        disabled={isSubmitting}
                    />
                    <Grid container className={classes.buttons}>
                        <Grid item xs={9}>
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                size="medium"
                                disabled={isSubmitting}
                            >
                                Send
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                component={Link}
                                to="/login"
                                variant="contained"
                                size="medium"
                                disabled={isSubmitting}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default ForgetPassword;