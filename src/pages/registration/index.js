import React from 'react';
import Button from '@material-ui/core/Button';
import useStyles from './styles'

function Registration() {
    const classes = useStyles();

    return (
        <>
            <h1 className={classes.green}>Halaman Registrasi</h1>
            <Button color='primary' variant='contained' size='small'>Click</Button>
        </>
    );
}

export default Registration;