import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

const AdminRoutes = () => {
  return (
    <Switch>
      <Route exact path="/admin/login" component={AdminLogin} />
      <Route exact path="/admin/panel" component={AdminPanel} />
    </Switch>
  );
};

export default AdminRoutes;
