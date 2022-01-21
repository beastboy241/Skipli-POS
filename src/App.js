import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Private from './pages/private';
import Login from './pages/login';
import ForgetPassword from './pages/forgetpassword';
import NotFound from './pages/404';
import Registration from './pages/registration';
import Home from './pages/private/home';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/registration" component={Registration} />
        <Route path="/forgetpassword" component={ForgetPassword} />
        <Route path="/settings" component={Private} />
        <Route path="/transaction" component={Private} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
