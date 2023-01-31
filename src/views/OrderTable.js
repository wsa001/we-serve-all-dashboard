import React, { Component } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Button,
  Spinner,
} from "reactstrap";
import Header from "./../components/Headers/Header.js";
import alertService from "../services/alertService";
import toastService from "../services/toastService";
import authService from "../services/authService";
import orderService from "../services/orderService.js";
import Location from "./location";
import notificationServices from "../services/notificationServices";
import emailServices from "../services/emailservice";
import userServices from "../services/userService";
class orderTable extends Component {
  state = {
    data: [],
    dataLoaded: false,
  };
  userRole = authService.getCurrentRole();
  async componentDidMount() {
    this.setState({ dataLoaded: false });

    try {
      let data = [];
      if (this.userRole.role === "admin") {
        const { data: response } = await orderService.getOrders();
        console.log(response.data);
        response.data.order.forEach((item, index) => data.push(item));
      } else if (this.userRole.role === "employee") {
        this.updateLoc();
        const empId = await authService.getCurrentUser()[0]._id;
        const { data: response } = await orderService.getOrderByEmp(empId);
        console.log(response.data);
        response.data.order.forEach((item, index) => data.push(item));
      }

      this.setState({ data: data });
      let order = ["in progress", "pending", "completed"];
      console.log(this.state.data);
      this.state.data = this.state.data.sort((x, y) =>
        order.indexOf(x.status) < order.indexOf(y.status)
          ? -1
          : order.indexOf(x.status) > order.indexOf(y.status)
          ? 1
          : 0
      );
      console.log(this.state.data);
    } catch (ex) {
      toastService.error(ex.message);
    }
    // console.log(this.state.data[0].servicesDetails.title);
    this.setState({ dataLoaded: true });
  }
  timer;
  updateLoc() {
    this.timer = setInterval(function () {
      Location.AddLocation();
    }, 10000);
  }
  stopLoc() {
    clearInterval(this.timer);
  }

  handleAdd = () => {
    this.props.history.push("/dashboard/users/add");
  };
  creacteNotification = async (userId) => {
    let notification = await notificationServices.addNotification({
      userId: userId,
      message: `${authService.getCurrentUser()[0].firstName} ${
        authService.getCurrentUser()[0].lastName
      } accept your order `,
      sender_name: authService.getCurrentUser()[0].userName,
    });
    console.log(notification);
  };
  createEmail = async (item) => {
    console.log("called");
  };
  handleEdit = (orderData, orderId, userId) => {
    try {
      alertService
        .show({
          title: "Are you sure?",
          text: `Do you want to accept this order `,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            console.log(orderData);
            let response = orderService.updateorder(orderData, orderId);
            response
              .then(async () => {
                if (this.userRole.role === "employee") {
                  this.creacteNotification(userId);
                  let user = await userServices.getUser(userId);
                  console.log();
                  let edata = {
                    to: user.data.data.user.email,
                    text: `${authService.getCurrentUser()[0].firstName}''${
                      authService.getCurrentUser()[0].lastName
                    } accept your order`,
                  };
                  let result = await emailServices.sendEmail(edata);
                  console.log(result);
                  if (result) {
                    window.location.reload();
                  }
                  // const data = this.state.data.filter(
                  //   (s) => s._id !== res.data.data.order._id
                  // );
                  // this.setState({ data: data });

                  toastService.success("Accepted Successfully");
                } else {
                }
              })
              .catch((ex) => {
                toastService.error(ex.message);
              });
          }
        });
    } catch (ex) {
      toastService.error(ex.message);
    }
    // this.props.history.push(`/dashboard/users/${userData._id}/edit`);
  };

  handleComplete = (orderData, orderId, userId) => {
    try {
      alertService
        .show({
          title: "Are you sure?",
          text: `Do you want to mark this order complete `,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            let response = orderService.updateorder(orderData, orderId);
            response
              .then(() => {
                toastService.success("Order Complete Successfully");
              })
              .catch((ex) => {
                toastService.error(ex.message);
              });
          }
        });
    } catch (ex) {
      toastService.error(ex.message);
    }

    // this.props.history.push(`/dashboard/users/${userData._id}/edit`);
  };

  // var timer;
  //  startTimer() {
  //           timer = setInterval(function() {
  //               alert("5 seconds are up");
  //           }, 5000);
  //       }
  handleDelete = (orderId) => {
    try {
      alertService
        .show({
          title: "Are you sure?",
          text: `Do you want to delete this order "`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            let response = orderService.deleteOrder(orderId);
            response
              .then((res) => {
                console.log(res);
                const data = this.state.data.filter(
                  (s) => s._id !== res.data.data.order._id
                );
                this.setState({ data: data });
                toastService.success("Order rejected");
              })
              .catch((ex) => {
                toastService.error(ex.message);
              });
          }
        });
    } catch (ex) {
      toastService.error(ex.message);
    }
  };
  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Order</h3>
                    </div>
                    {/* <div className="col text-right">
                      {["employee"].filter(
                        (role) => role === this.userRole.role
                      ).length > 0 && (
                        <Button
                          color="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            this.handleAdd();
                          }}
                          size="sm"
                        >
                          Add
                        </Button>
                      )}
                    </div> */}
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Service Name</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Location</th>
                      <th scope="col">Status</th>
                      <th scope="col">Customer Phn No.</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.data &&
                      this.state.data.map((item) => (
                        <tr key={item.id}>
                          <th scope="row">
                            <Media className="align-items-center">
                              <Media>
                                <span className="mb-0 text-sm">
                                  {item.servicesDetails.title}
                                </span>
                              </Media>
                            </Media>
                          </th>
                          <td>{item.servicesDetails.price}</td>
                          <td>{item.location[0].longitude}</td>
                          <td>{item.status}</td>
                          <td>{item.phnno}</td>
                          <td className="text-right">
                            {["employee"].filter(
                              (role) => role === this.userRole.role
                            ).length > 0 && (
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="btn-icon-only text-light"
                                  role="button"
                                  size="sm"
                                  color=""
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu
                                  className="dropdown-menu-arrow"
                                  right
                                >
                                  {item.status === "pending" ? (
                                    <>
                                      <DropdownItem
                                        onClick={(e) => {
                                          e.preventDefault();
                                          const orderData = {
                                            status: "in progress",
                                          };

                                          this.handleEdit(
                                            orderData,
                                            item._id,
                                            item.userId
                                          );
                                        }}
                                      >
                                        Accept
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={(e) => {
                                          e.preventDefault();
                                          this.handleDelete(item._id);
                                        }}
                                      >
                                        Reject
                                      </DropdownItem>
                                    </>
                                  ) : (
                                    <DropdownItem
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const orderData = {
                                          status: "completed",
                                        };
                                        this.handleComplete(
                                          orderData,
                                          item._id
                                        );
                                      }}
                                    >
                                      completed
                                    </DropdownItem>
                                  )}
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  {}
                </Table>
                {!this.state.dataLoaded && (
                  <div className="text-center m-5">
                    <Spinner type="grow" color="primary" />
                  </div>
                )}
                {this.state.dataLoaded && this.state.data.length < 1 && (
                  <div className="text-center m-5">
                    <p>No data to show </p>
                  </div>
                )}
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default orderTable;
