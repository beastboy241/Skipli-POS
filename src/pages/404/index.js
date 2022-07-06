import React from "react";
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import {Link} from 'react-router-dom';
import useStyles from './styles';

const NotFound = () => {
    const classes = useStyles();
    return (
        <Container maxWidht="xs">
            <Paper className={classes.paper}>
                <Typography variant="subtitle1">
                    page not found
                </Typography>
                <Typography variant="h3">
                    404
                </Typography>
                <Typography component={Link} to="/">                
                    Back to Home
                </Typography>
            </Paper>
        </Container>
    )
}

export default NotFound;