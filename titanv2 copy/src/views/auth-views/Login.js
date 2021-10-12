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
import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Spinner,
  Alert
} from "reactstrap";
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
// core components
import AuthHeader from "components/Headers/AuthHeader.js";
import { AUTH_SIGN_UP_PATH, APP_DASHBOARD_PATH } from 'configs/AppConfig'
import { signIn, hideAuthMessage } from 'redux/actions/Auth'
function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(({ auth }) => auth.loading);
  const message = useSelector(({ auth }) => auth.message);
  const showMessage = useSelector(({ auth }) => auth.showMessage);
  const token = useSelector(({ auth }) => auth.token);
  const [focusedEmail, setfocusedEmail] = React.useState(false);
  const [focusedPassword, setfocusedPassword] = React.useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(hideAuthMessage())
  }, [])

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        dispatch(hideAuthMessage())
      }, 10000);
    }
  }, [showMessage])

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  }
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  }
  const creatAccount = (e) => {
    e.preventDefault();
    history.push(AUTH_SIGN_UP_PATH);
  }
  const onSignIn = (e) => {
    e.preventDefault();
    dispatch(signIn({ email, password }))
  }
  return (
    <>
      <AuthHeader
        title="Welcome!"
      // lead="Use these awesome forms to login or create new account in your project for free."
      />
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="bg-secondary border-0 mb-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>Sign in with credentials</small>
                </div>
                {showMessage && (
                  <Alert color="danger">
                    {message}
                  </Alert>
                )}
                <Form role="form" onSubmit={onSignIn}>
                  <FormGroup
                    className={classnames("mb-3", {
                      focused: focusedEmail,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        placeholder="Email"
                        type="email"
                        onFocus={() => setfocusedEmail(true)}
                        onBlur={() => setfocusedEmail(true)}
                        onChange={onEmailChange}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedPassword,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        placeholder="Password"
                        type="password"
                        onFocus={() => setfocusedPassword(true)}
                        onBlur={() => setfocusedPassword(true)}
                        onChange={onPasswordChange}
                      />
                    </InputGroup>
                  </FormGroup>
                  {/* <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id=" customCheckLogin"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor=" customCheckLogin"
                    >
                      <span className="text-muted">Remember me</span>
                    </label>
                  </div> */}
                  <div className="text-center">
                    <Button
                      className="my-4"
                      color="info"
                      type="submit"
                      disabled={loading}
                    >
                      {loading && (
                        <Spinner size="sm" color="white" className="mr-2" />
                      )}
                      Sign in
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <Row className="mt-3">
              <Col xs="6">
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small>Forgot password?</small>
                </a>
              </Col>
              <Col className="text-right" xs="6">
                <a
                  className="text-light"
                  onClick={creatAccount}
                >
                  <small>Create new account</small>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
