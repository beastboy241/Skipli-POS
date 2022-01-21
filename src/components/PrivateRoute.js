import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({component:Component, ...restProps}) => {
    const user = null;
    return <Route
        {...restProps}
        render={props => {
            return user ?
            <Component {...props} />
            :
            <Navigate to='/login' />
        }}
    />
}

export default PrivateRoute;