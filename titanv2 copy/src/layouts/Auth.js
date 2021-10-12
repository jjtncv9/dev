/*!

=========================================================
* Argon Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect } from "react";
// react library for routing
import { useLocation, Route, Switch, Redirect, useHistory } from "react-router-dom";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import routes from "routes.js";
import { signOut } from 'redux/actions/Auth'
import { auth } from 'auth/FirebaseAuth';
import { AUTH_SIGN_IN_PATH, APP_DASHBOARD_PATH } from "configs/AppConfig";
import { useDispatch } from "react-redux";

function Auth() {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const mainContentRef = React.useRef(null);
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
    document.body.classList.add("bg-default");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.remove("bg-default");
    };
  });
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, [location]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) history.push(APP_DASHBOARD_PATH);
    });
    return () => unsubscribe(); // unsubscribing from the listener when the component is unmounting.
  }, [])
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div className="main-content" ref={mainContentRef}>
        <AuthNavbar />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/auth/login" />
        </Switch>
      </div>
      <AuthFooter />
    </>
  );
}

export default Auth;
