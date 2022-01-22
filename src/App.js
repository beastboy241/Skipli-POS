import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Private from './pages/private';
import Login from './pages/login';
import ForgetPassword from './pages/forgetpassword';
import NotFound from './pages/404';
import Registration from './pages/registration';
import PrivateRoute from './components/PrivateRoute';
import FirebaseProvider from './components/FirebaseProvider';

function App() {
  return (
    <FirebaseProvider>
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path="/" component={Private} />
          <PrivateRoute path="/settings" component={Private} />
          <PrivateRoute path="/product" component={Private} />
          <PrivateRoute path="/transaction" component={Private} />
          <Route path="/login" component={Login} />
          <Route path="/registration" component={Registration} />
          <Route path="/forgetpassword" component={ForgetPassword} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </FirebaseProvider>
  );
}

export default App;
