import React, { Component } from "react";
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
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { Redirect } from "react-router-dom";
import authService from "../services/authService";
import validationService from "../services/validationService";
import toastService from "../services/toastService";
import Joi from "joi";
import userService from "../services/userService";
import emailServices from "../services/emailservice";
class RegisterForm extends Component {
  state = {
    showFields: false,
    registredbutton: false,
    data: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      role: "employee",
      password: "",
      imageURL: "",
      otp: "",
    },
    errors: {},
    submitDisabled: false,
  };

  schema = Joi.object().keys({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    userName: Joi.string()
      .required()
      .label("UserName")
      .custom((value, helpers) => {
        if (
          !value.match(/^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
        ) {
          return helpers.message(
            "{{#label}} should be minimum 5 and maximum 20 characters, alphanumeric characters, numbers, underscore and dot"
          );
        }
        return value;
      }),
    role: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .label("Email"),
    password: Joi.string()
      .required()
      .label("Password")
      .custom((value, helpers) => {
        if (
          !value.match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/
          )
        ) {
          return helpers.message(
            "{{#label}} should be minimum 8 and maximum 30 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
          );
        }
        return value;
      }),
    imageURL: Joi.string(),
    otp: Joi.number(),
  });
  handelSelectedFile = async (e) => {
    const file = e.target.files[0];
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "uts5ahls");
    formData.append("cloud_name", "dypgiir37");
    fetch("https://api.cloudinary.com/v1_1/dypgiir37/image/upload", {
      body: formData,
      method: "post",
    })
      .then((res) => res.json())
      .then((data) => (this.state.data.imageURL = data.url))
      .catch((err) => console.log(err));
  };
  handleSubmit = () => {
    const errors = validationService.validate(this.state.data, this.schema);
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = validationService.validateProperty(input, this.schema);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };
  sendEmail = async () => {
    let alreaduser = await userService.getUserByEmail(this.state.data.email);
    if (alreaduser.data.data.user.length === 0) {
      const data = {
        to: this.state.data.email,
      };
      let alreadyemail = await emailServices.getemail(this.state.data.email);
      if (alreadyemail.data.data.code.length === 0) {
        let result = await emailServices.sendEmail(data);
        toastService.info("we Send You An Varification Code Via Email");
        this.setState({ showFields: true });
        console.log(result);
      } else {
        toastService.info("We Already Send You An Email");
        this.setState({ showFields: true });
      }
    } else {
      toastService.error("User With Email Is Already Exist");
    }
  };
  varifyemail = async () => {
    let result = await emailServices.getemail(this.state.data.email);
    if (!result) {
      toastService.error("Invalid Otp");
    } else {
      let code = result.data.data.code[0].code;
      if (this.state.data.otp === code) {
        toastService.success("Verified");
        await emailServices.deletecode(this.state.data.email);
        this.setState({ registredbutton: true });
        this.setState({ showFields: false });
      } else {
        toastService.error("Invalid OTP");
      }
    }
  };
  doSubmit = async () => {
    this.setState({ submitDisabled: true });
    const { data } = this.state;
    data.role = "employee";
    console.log(data);
    try {
      let response = await authService.register(data);
      this.setState({ submitDisabled: false });
      toastService.success("Account created Please Login to Continue");
      this.props.history.push("/auth/login");
    } catch (ex) {
      toastService.error(ex.message);
      this.setState({ submitDisabled: false });
    }
  };

  render() {
    if (authService.getCurrentUser()) return <Redirect to="/dashboard" />;
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent text-center">
              <h3 className="mb-0">Register</h3>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      type="name"
                      autoComplete="new-firstName"
                      value={this.state.data.firstName}
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                  {this.state.errors.firstName && (
                    <small className="text-danger mx-1">
                      {this.state.errors.firstName}
                    </small>
                  )}
                </FormGroup>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      type="name"
                      autoComplete="new-lastName"
                      value={this.state.data.lastName}
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                  {this.state.errors.lastName && (
                    <small className="text-danger mx-1">
                      {this.state.errors.lastName}
                    </small>
                  )}
                </FormGroup>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="userName"
                      placeholder="Username"
                      type="name"
                      autoComplete="new-userName"
                      value={this.state.data.userName}
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                  {this.state.errors.userName && (
                    <small className="text-danger mx-1">
                      {this.state.errors.userName}
                    </small>
                  )}
                </FormGroup>
                <Row>
                  <div className="col-lg-9">
                    <FormGroup className="mb-3 ">
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          name="email"
                          placeholder="Email"
                          type="email"
                          autoComplete="new-email"
                          value={this.state.data.email}
                          onChange={this.handleChange}
                        />
                      </InputGroup>
                      {this.state.errors.email && (
                        <small className="text-danger mx-1">
                          {this.state.errors.email}
                        </small>
                      )}
                    </FormGroup>
                  </div>
                  <div className="col-lg-3">
                    <Button
                      // className="mt-"
                      color="primary"
                      type="button"
                      disabled={this.state.submitDisabled}
                      onClick={(e) => {
                        this.sendEmail();
                      }}
                    >
                      {this.state.submitDisabled && (
                        <Spinner type="grow" color="light" size="sm" />
                      )}
                      {!this.state.submitDisabled && "OTP"}
                    </Button>
                  </div>
                </Row>
                {this.state.showFields && (
                  <Row id="varification">
                    <div className="col-lg-9">
                      <FormGroup className="mb-3 ">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            name="otp"
                            placeholder="otp"
                            type="int"
                            autoComplete="new-otp"
                            value={this.state.data.otp}
                            onChange={this.handleChange}
                          />
                        </InputGroup>
                        {this.state.errors.otp && (
                          <small className="text-danger mx-1">
                            {this.state.errors.otp}
                          </small>
                        )}
                      </FormGroup>
                    </div>
                    <div className="col-lg-3">
                      <Button
                        // className="mt-"
                        color="primary"
                        type="button"
                        disabled={this.state.submitDisabled}
                        onClick={(e) => {
                          this.varifyemail();
                        }}
                      >
                        varify
                      </Button>
                    </div>
                  </Row>
                )}
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="password"
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      value={this.state.data.password}
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                  {this.state.errors.password && (
                    <small className="text-danger mx-1">
                      {this.state.errors.password}
                    </small>
                  )}
                </FormGroup>
                <div>
                  <h5>Image Upload </h5>
                  <div>
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={(e) => {
                        this.handelSelectedFile(e);
                      }}
                    />
                  </div>
                  {/* <div>
                          <img
                            src={imageURL}
                            alt="image"
                            width="200px"
                            height={"200px"}
                          />
                        </div> */}
                </div>
                {/*<div className="text-muted font-italic">*/}
                {/*  <small>*/}
                {/*    password strength:{" "}*/}
                {/*    <span className="text-success font-weight-700">strong</span>*/}
                {/*  </small>*/}
                {/*</div>*/}
                {/*<Row className="my-4">*/}
                {/*  <Col xs="12">*/}
                {/*    <div className="custom-control custom-control-alternative custom-checkbox">*/}
                {/*      <input*/}
                {/*          className="custom-control-input"*/}
                {/*          id="customCheckRegister"*/}
                {/*          type="checkbox"*/}
                {/*      />*/}
                {/*      <label*/}
                {/*          className="custom-control-label"*/}
                {/*          htmlFor="customCheckRegister"*/}
                {/*      >*/}
                {/*    <span className="text-muted">*/}
                {/*      I agree with the{" "}*/}
                {/*      <a*/}
                {/*        onClick={(e) => e.preventDefault()}>*/}
                {/*        Privacy Policy*/}
                {/*      </a>*/}
                {/*    </span>*/}
                {/*      </label>*/}
                {/*    </div>*/}
                {/*  </Col>*/}
                {/*</Row>*/}

                {this.state.registredbutton && (
                  <div className="text-center">
                    <Button
                      className="mt-4"
                      color="primary"
                      type="button"
                      disabled={this.state.submitDisabled}
                      onClick={(e) => {
                        e.preventDefault();
                        this.handleSubmit();
                      }}
                    >
                      {this.state.submitDisabled && (
                        <Spinner type="grow" color="light" size="sm" />
                      )}
                      {!this.state.submitDisabled && "Create account"}
                    </Button>
                  </div>
                )}
              </Form>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default RegisterForm;
