import React from "react";
import {Switch, Route} from "react-router-dom";
import User from './user';
import Store from './store';

const Settings = () => {
    return(
        <Switch>
            <Route path="/settings/user" component={User} />
            <Route path="/settings/store" component={Store} />
        </Switch>
    );
}

export default Settings;