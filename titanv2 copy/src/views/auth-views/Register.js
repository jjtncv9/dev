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
  Alert,
  Spinner
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// core components
import AuthHeader from "components/Headers/AuthHeader.js";
import { signUp } from "redux/actions/Auth"
import { APP_DASHBOARD_PATH } from "configs/AppConfig"
import { hideAuthMessage } from 'redux/actions/Auth'

function Register() {
  const dispatch = useDispatch();
  const history = useHistory();
  const showMessage = useSelector(({ auth }) => auth.showMessage);
  const loading = useSelector(({ auth }) => auth.loading);
  const message = useSelector(({ auth }) => auth.message);
  const token = useSelector(({ auth }) => auth.token);
  const [focusedName, setfocusedName] = React.useState(false);
  const [focusedEmail, setfocusedEmail] = React.useState(false);
  const [focusedPassword, setfocusedPassword] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(hideAuthMessage())
  }, [])
  const onSignUp = (e) => {
    e.preventDefault();
    console.log(email, name, password)
    dispatch(signUp({ name, email, password }));
  }
  return (
    <>
      <AuthHeader
        title="Create an account"
      // lead="Use these awesome forms to login or create new account in your project for free."
      />
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="6" md="8">
            <Card className="bg-secondary border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>Sign up with credentials</small>
                </div>
                {showMessage && (
                  <Alert color="danger">
                    {message}
                  </Alert>
                )}
                <Form role="form" onSubmit={onSignUp}>
                  <FormGroup
                    className={classnames({
                      focused: focusedName,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        required
                        placeholder="Name"
                        type="text"
                        onFocus={() => setfocusedName(true)}
                        onBlur={() => setfocusedName(false)}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedEmail,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative mb-3">
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
                        onBlur={() => setfocusedEmail(false)}
                        onChange={(e) => setEmail(e.target.value)}
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
                        placeholder="Password"
                        required
                        type="password"
                        onFocus={() => setfocusedPassword(true)}
                        onBlur={() => setfocusedPassword(false)}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  {/* <div className="text-muted font-italic">
                    <small>
                      password strength:{" "}
                      <span className="text-success font-weight-700">
                        strong
                      </span>
                    </small>
                  </div> */}
                  {/* <Row className="my-4">
                    <Col xs="12">
                      <div className="custom-control custom-control-alternative custom-checkbox">
                        <input
                          className="custom-control-input"
                          id="customCheckRegister"
                          type="checkbox"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customCheckRegister"
                        >
                          <span className="text-muted">
                            I agree with the{" "}
                            <a
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                      </div>
                    </Col>
                  </Row> */}
                  <div className="text-center">
                    <Button className="mt-4" color="info" type="submit" disabled={loading}>
                      {loading && (
                        <Spinner size="sm" color="white" className="mr-2" />
                      )}
                      Create account
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Register;
