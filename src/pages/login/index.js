import React, { useState } from 'react';
import useStyles from './styles'
import { Container, Paper, Typography, TextField, Grid, Button } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import { useFirebase } from '../../components/FirebaseProvider';
import AppLoading from '../../components/apploading';

function Login(props) {
    const { location } = props;
    const classes = useStyles();

    const [form, setForm] = useState({
        email: '',
        password: ''
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
        password: ''
    })

    const validate = () => {
        const newError = { ...error };
        if (!form.email) {
            newError.email = 'Email wajib diisi';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email tidak valid';
        }
        if (!form.password) {
            newError.password = 'Password wajib diisi';
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
                    auth.signInWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {};

                switch (e.code) {
                    case 'auth/user-not-found': newError.email = 'Email belum terdaftar';
                        break;
                    case 'auth/invalid-email': newError.email = 'Email tidak valid';
                        break;
                    case 'auth/wrong-password': newError.password = 'Password salah';
                        break;
                    case 'auth/user-disabled': newError.email = 'Akun diblokir';
                        break;
                    default:
                        newError.email = 'Terjadi kesalahan silahkan coba lagi';
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
        const redirecTo = location.state && location.state.from && location.state.from.pathname ? location.state.from.pathname : '/';
        return <Redirect to={redirecTo} />
    }

    return (
        <Container maxWidth="xs">
            <Paper className={classes.paper}>
                <Typography variant="h5" component="h1" className={classes.title}>
                    Login
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        margin="normal"
                        label="Alamat Email"
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
                    <Grid container className={classes.buttons}>
                        <Grid item xs={9}>
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                size="medium"
                                disabled={isSubmitting}
                            >
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                component={Link}
                                to="/registration"
                                variant="contained"
                                size="medium"
                                disabled={isSubmitting}
                            >
                                Daftar
                            </Button>
                        </Grid>
                    </Grid>
                    <div className={classes.forget}>
                        <Typography component={Link} to="/forgetpassword">
                            Lupa Password ?
                        </Typography>
                    </div>
                </form>
            </Paper>
        </Container>
    );
}

export default Login;