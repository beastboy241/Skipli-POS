import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Settings from './settings';

function Private(){
    return(
        <Switch>
            <Route path="/settings" component={Settings} />
        </Switch>
    );
}

export default Private;