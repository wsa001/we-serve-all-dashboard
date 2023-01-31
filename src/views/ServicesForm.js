import React, { Component } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import Header from "../components/Headers/Header";
import Joi from "joi";
import validationService from "../services/validationService";
import _, { join } from "lodash";
import toastService from "../services/toastService";
import alertService from "../services/alertService";
import authService from "../services/authService";
import servicesService from "../services/servicesService";

class ServiceForm extends Component {
  state = {
    data: {
      _id: 0,
      userId: 0,
      title: "",
      description: "",
      catagory: "",
      price: 0,
      rating: 0.0,
      approved: false,
      imageURL: "",
    },
    errors: {},
    submitDisabled: false,
    formEnabled: false,
    dataLoaded: false,
  };
  schema = Joi.object().keys({
    _id: Joi.string(),
    userId: Joi.string().label("User Id"),
    title: Joi.string().required().label("Title"),
    catagory: Joi.string().required().label("Catagory"),
    description: Joi.string().required().label("Description"),
    price: Joi.number().required().label("Price"),
    rating: Joi.number(),
    approved: Joi.boolean(),
    imageURL: Joi.string().uri().required(),
  });
  userRole = authService.getCurrentRole();
  userId = authService.getCurrentUser()[0]._id;

  async componentDidMount() {
    let img;
    this.setState({ formEnabled: false, dataLoaded: false });
    const serviceId = this.props.match.params.serviceId;
    console.log(serviceId);
    if (serviceId) {
      try {
        const { data: response } = await servicesService.getService(serviceId);
        console.log(response.data.service);
        if (response.data.service) {
          this.setState({
            data: _.pick(response.data.service, [
              "_id",
              "userId",
              "title",
              "catagory",
              "price",
              "description",
              "price",
              "rating",
              "approved",
            ]),
          });
        }
      } catch (ex) {
        toastService.error(ex.message);
      }
    }
    this.setState({ formEnabled: true, dataLoaded: true });
  }

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
      .then((data) => (this.img = data.url))
      .catch((err) => console.log(err));
  };

  handleSubmit = () => {
    // const errors = validationService.validate(this.state.data, this.schema);
    // this.setState({ errors: errors || {} });
    // console.log(errors);
    // if (errors) return;
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

  doSubmit = async () => {
    this.setState({ submitDisabled: true });
    const { data } = this.state;
    console.log(data);

    data.userId = authService.getCurrentUser()[0]._id;
    data.rating = 0.0;
    data.imageURL = this.img;
    console.log(data);
    this.setState({ formEnabled: false });
    try {
      console.log(this.state.data._id === 0);
      if (this.state.data._id === 0) {
        let response = await servicesService.addService(data);
        alertService.show({ text: "Services Added", icon: "success" });
        console.log(response);
        this.setState({ submitDisabled: false });
        this.props.history.push(`/dashboard/Services`);
      } else {
        let response = await servicesService.updateService(data);
        alertService.show({ text: "Service Updated", icon: "success" });
        this.props.history.push(`/dashboard/Services`);
        this.setState({ submitDisabled: false });
      }
    } catch (ex) {
      toastService.error(ex.message);
      this.setState({ submitDisabled: false });
    }
  };

  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">
                        {this.state.data._id === 0
                          ? "Add Service"
                          : `Update Service: ${this.state.data._id}`}
                      </h3>
                    </Col>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        disabled={this.state.submitDisabled}
                        onClick={(e) => {
                          console.log(this.state.data);
                          e.preventDefault();
                          this.handleSubmit();
                        }}
                        size="sm"
                      >
                        {this.state.submitDisabled && (
                          <Spinner type="grow" color="light" size="sm" />
                        )}

                        {this.state.data._id === 0 ? "Save" : "Update"}
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {this.state.dataLoaded && (
                    <Form>
                      <h6 className="heading-small text-muted mb-4">
                        Service information
                      </h6>
                      <div className="pl-lg-4">
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-tilte"
                              >
                                Title
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-title"
                                name="title"
                                placeholder="Title"
                                type="text"
                                autoComplete="new-title"
                                value={this.state.data.title}
                                onChange={this.handleChange}
                              />
                              {this.state.errors.name && (
                                <small className="text-danger mx-1">
                                  {this.state.errors.name}
                                </small>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-description"
                              >
                                Description
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-description"
                                name="description"
                                placeholder="description"
                                type="text"
                                autoComplete="new-description"
                                value={this.state.data.description}
                                onChange={this.handleChange}
                              />
                              {this.state.errors.description && (
                                <small className="text-danger mx-1">
                                  {this.state.errors.description}
                                </small>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-catagory"
                              >
                                Catagory
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-catagory"
                                name="catagory"
                                placeholder="Catagory"
                                type="text"
                                autoComplete="new-catagory"
                                value={this.state.data.catagory}
                                onChange={this.handleChange}
                              />
                              {this.state.errors.catagory && (
                                <small className="text-danger mx-1">
                                  {this.state.errors.catagory}
                                </small>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-price"
                              >
                                Price
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-price"
                                name="price"
                                placeholder="Price"
                                type="text"
                                autoComplete="new-price"
                                value={this.state.data.price}
                                onChange={this.handleChange}
                              />
                              {this.state.errors.price && (
                                <small className="text-danger mx-1">
                                  {this.state.errors.price}
                                </small>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="4">
                            <div>
                              <label
                                className="form-control-label"
                                htmlFor="input-price"
                              >
                                Upload Picture
                              </label>
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
                            </div>
                          </Col>
                          <Col md="4">
                            {this.state.dataLoaded &&
                              ["admin"].filter(
                                (role) => role === this.userRole.role
                              ).length > 0 && (
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-price"
                                  >
                                    Approved
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-approved"
                                    name="approved"
                                    type="text"
                                    autoComplete="new-approved"
                                    value={this.state.data.approved}
                                    onChange={this.handleChange}
                                  />
                                  {this.state.errors.approved && (
                                    <small className="text-danger mx-1">
                                      {this.state.errors.approved}
                                    </small>
                                  )}
                                </FormGroup>
                              )}
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  )}
                  {!this.state.dataLoaded && (
                    <div className="text-center m-5">
                      <Spinner type="grow" color="primary" />
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default ServiceForm;
