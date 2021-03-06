import React from 'react';
import { Container, Typography } from '@material-ui/core';
import LinierProgress from '@material-ui/core/LinearProgress';
import useStyles from './styles';

function AppLoading(){
    const classes = useStyles();

    return (
        <Container maxWidth="xs">
            <div className={classes.loadingBox}>
                <Typography
                    variant="h6"
                    component="h2"
                    className={classes.title}
                >
                    Restaurant POS
                </Typography>
                <LinierProgress />
            </div>
        </Container>
    )
}

export default AppLoading;