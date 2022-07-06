import React, { useState } from 'react';
import useStyles from './styles'
import { Container, Paper, Typography, TextField, Grid, Button } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import { useFirebase } from '../../components/FirebaseProvider';
import AppLoading from '../../components/apploading';

function Registration() {
    const classes = useStyles();

    const [form, setForm] = useState({
        email: '',
        password: '',
        repeat_password: ''
    });

    const [isSubmitting, setSubmitting] = useState(false);

    const { auth, user, loading } = useFirebase();

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
        email: '',
        password: '',
        repeat_password: ''
    })

    const validate = () => {
        const newError = { ...error };
        if (!form.email) {
            newError.email = 'Email is required';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email is not valid';
        }
        if (!form.password) {
            newError.password = 'Password is required';
        }
        if (!form.repeat_password) {
            newError.repeat_password = 'Repeat Password is required';
        } else if (form.repeat_password !== form.password) {
            newError.repeat_password = 'Repeat Password is not the same as Password';
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
                await
                    auth.createUserWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {};

                switch (e.code) {
                    case 'auth/email-already-in-use': newError.email = 'Email already registered';
                        break;
                    case 'auth/invalid-email': newError.email = 'Email is notvalid';
                        break;
                    case 'auth/weak-password': newError.password = 'Password too weak ';
                        break;
                    case 'auth/operation-not-allowed': newError.email = 'Email and password methods are not supported';
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
                    Create New Account
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        margin="normal"
                        label= "New user Email"
                        fullWidth
                        required
                        value={form.email}
                        onChange={handleChange}
                        helperText={error.email}
                        error={error.email ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="password"
                        type="password"
                        name="password"
                        margin="normal"
                        label="Password"
                        fullWidth
                        required
                        value={form.password}
                        onChange={handleChange}
                        helperText={error.password}
                        error={error.password ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="repeat_password"
                        type="password"
                        name="repeat_password"
                        margin="normal"
                        label="Repeat Password"
                        fullWidth
                        required
                        value={form.repeat_password}
                        onChange={handleChange}
                        helperText={error.repeat_password}
                        error={error.repeat_password ? true : false}
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
                                Register
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

export default Registration;