import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';

// metarial-ui
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

import Restaurant from './restaurant'
import User from './user'

import useStyles from "./styles";

const Settings = (props) => {
    const { location, history } = props;
    const handleChangeTab = (event, value) => {
        history.push(value)
    }
    const classes = useStyles();

    return (
        <Paper>
            <Tabs
                value={location.pathname}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChangeTab}
            >
                <Tab label="User" value="/settings/user" />
                {/*<Tab label="Restaurant" value="/settings/restaurant" />*/}
            </Tabs>
            <div className={classes.tabContent}>
                <Switch>
                    <Route path="/settings/user" component={User} />
                    <Route path="/settings/restaurant" component={Restaurant} />
                    <Redirect to="/settings/user" />
                </Switch>
            </div>
        </Paper>
    );
}

export default Settings;