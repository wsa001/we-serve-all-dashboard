import React, { Component } from "react";
import toastService from "../services/toastService.js";
import Header from "../components/Headers/Header.js";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import authService from "../services/authService";
import getDataServices from "../services/getDataServices.js";
import notificationServices from "../services/notificationServices.js";

class Dashboard extends Component {
  state = {
    dataLoaded: true,
    data: {
      totalUser: 0,
      totalempUser: 0,
      totalservices: 0,
      totalactivorder: 0,
      totalactiveservices: 0,
      totalpendingservices: 0,
    },
  };

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    // if (this.userRole.role === "admin") {
    //   const { datarole: response } = await adminService.getAdmin(1);
    //   console.log(response.data);
    //   if (response.data.admin) {
    //     console.log(response.data.admin);
    //     this.setState({ data: response.data.admin, dataLoaded: true });
    //   }
    // } else {
    // }

    this.setState({ dataLoaded: false });
    let role = await authService.getCurrentRole()[0];
    try {
      if (role === "admin") {
        const { data: response } = await getDataServices.getData();
        console.log(response.data.data);
        this.setState({ data: response.data.data });
      } else {
        const { data: response } = await getDataServices.getEmpData(
          authService.getCurrentUser()[0]._id
        );
        console.log(response);
        this.setState({ data: response.data.data });
        this.getnotification();
      }
    } catch (ex) {
      toastService.error(ex.message);
    }
    this.setState({ dataLoaded: true });
  }
  timer;
  getnotification() {
    this.timer = setInterval(async function () {
      try {
        let notification = await notificationServices.getNotification(
          authService.getCurrentUser()[0]._id
        );
        if (notification) {
          toastService.info(notification.data.data.notification[0].message);
          console.log(notification.data.data.notification[0].message);
          await notificationServices.deleteNotification(
            notification.data.data.notification[0]._id
          );
        }
      } catch {}
    }, 10000);
  }

  stopnotification() {
    clearInterval(this.timer);
  }
  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          {this.state.dataLoaded &&
            ["employee"].filter((role) => role === this.userRole.role).length >
              0 && (
              <Row>
                <Container fluid>
                  <div className="header-body">
                    <Row>
                      <Col lg="6" xl="4">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Users
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {this.state.data.totalUser}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-red text-white rounded-circle shadow">
                                  <i className="ni ni-building" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="4">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Active Services
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {this.state.data.totalactiveservices}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-green text-white rounded-circle shadow">
                                  <i className="ni ni-shop" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="4">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Pending Services
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {this.state.data.totalpendingservices}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-orange text-white rounded-circle shadow">
                                  <i className="ni ni-badge" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      {/* <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Active Orders
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {this.state.data.totalactivorder}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                  <i className="ni ni-bullet-list-67" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col> */}
                    </Row>
                  </div>
                </Container>
              </Row>
            )}

          {this.state.dataLoaded &&
            ["admin"].filter((role) => role === this.userRole.role).length >
              0 && (
              <Row>
                <Container fluid>
                  <div className="header-body">
                    <Row>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Users
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {this.state.data.totalUser}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-red text-white rounded-circle shadow">
                                  <i className="ni ni-building" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Employee
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {this.state.data.totalempUser}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-green text-white rounded-circle shadow">
                                  <i className="ni ni-shop" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Services
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {this.state.data.totalservices}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-orange text-white rounded-circle shadow">
                                  <i className="ni ni-badge" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Active Orders
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {this.state.data.totalservices}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                  <i className="ni ni-bullet-list-67" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Container>
              </Row>
            )}
          {this.state.dataLoaded &&
            ["admin", "employee"].filter((role) => role === this.userRole.role)
              .length === 0 && (
              <Row>
                <Container fluid>
                  <div className="header-body">
                    <Row>
                      <Col lg="12">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  New User?
                                </CardTitle>
                                <span className="mb-0">
                                  You are not connected to any role. Please
                                  Logout and Login again. If still counter
                                  problem contact your admin.
                                </span>
                              </div>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Container>
              </Row>
            )}
        </Container>
        {!this.state.dataLoaded && (
          <div className="text-center mt-7 pt-5">
            <Spinner type="grow" color="primary" />
          </div>
        )}
      </>
    );
  }
}

export default Dashboard;
