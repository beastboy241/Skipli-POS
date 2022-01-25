import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import User from './user';
import Store from './store';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import useStyles from "./styles";

const Settings = (props) => {
    const { location, history } = props;
    const handleChangeTab = (event, value) => {
        history.push(value)
    }
    const classes = useStyles();

    return (
        <Paper square>
            <Tabs
                value={location.pathname}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChangeTab}
            >
                <Tab label="User" value="/settings/user" />
                <Tab label="Store" value="/settings/store" />
            </Tabs>
            <div className={classes.tabContent}>
                <Switch>
                    <Route path="/settings/user" component={User} />
                    <Route path="/settings/store" component={Store} />
                    <Redirect to="/settings/user" />
                </Switch>
            </div>
        </Paper>
    );
}

export default Settings;