import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH, RTL_PREFIX_PATH } from 'configs/AppConfig'
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";
import AuthLayout from "layouts/Auth.js";
import IndexView from "views/app-views/Index.js";

export const Views = (props) => {
  return (
    <Switch>
      <Route exact path="/" render={(props) => <IndexView {...props} />} />
      <Route path={RTL_PREFIX_PATH} render={(props) => <RTLLayout {...props} />} />
      <Route path={AUTH_PREFIX_PATH} render={(props) => <AuthLayout {...props} />} />
      <Route path={APP_PREFIX_PATH}>
        <AdminLayout {...props} />
      </Route>
    </Switch>
  )
}

export default Views;
