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
import servicesService from "../services/servicesService.js";
import userService from "../services/userService.js";
class userTable extends Component {
  state = {
    user: [],
    dataLoaded: false,
  };

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ dataLoaded: false });
    try {
      const { data: response } = await userService.getUsers();
      console.log(response.data.users);
      if (response.data.users) {
        let user = [];
        response.data.users.forEach((item, index) => {
          if (this.userRole.role === "admin") {
            user.push(item);
          } else if (
            this.userRole.role === "employee" &&
            item.userId === authService.getCurrentUser()[0]._id
          ) {
            user.push(item);
          }
        });
        this.setState({ user: user });
      }
    } catch (ex) {
      toastService.error(ex.message);
    }
    this.setState({ dataLoaded: true });
  }

  handleAdd = () => {
    this.props.history.push("/dashboard/users/add");
  };

  handleEdit = (userData) => {
    this.props.history.push(`/dashboard/users/${userData._id}/edit`);
  };

  handleDelete = (userData) => {
    try {
      alertService
        .show({
          title: "Are you sure?",
          text: `Do you want to delete User "${userData.userName}"`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            let response = userService.deleteUser(userData._id);
            response
              .then((res) => {
                console.log(res);
                const user = this.state.user.filter(
                  (s) => s._id !== res.data.data.user._id
                );
                this.setState({ user: user });
                toastService.success("Deleted Successfully");
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
                      <h3 className="mb-0">User</h3>
                    </div>
                    <div className="col text-right">
                      {/* {["employee"].filter(
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
                      )} */}
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">first Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Role</th>
                      <th scope="col">User Name</th>
                      <th scope="col">Email</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.user &&
                      this.state.user.map((item) => (
                        <tr key={item.id}>
                          <th scope="row">
                            <Media className="align-items-center">
                              <Media>
                                <span className="mb-0 text-sm">
                                  {item.firstName}
                                </span>
                              </Media>
                            </Media>
                          </th>
                          <td>{item.lastName}</td>
                          <td>{item.role}</td>
                          <td>{item.userName}</td>
                          <td>{item.email}</td>
                          <td className="text-right">
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
                                {/* <DropdownItem
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.handleEdit(item);
                                  }}
                                >
                                  Edit
                                </DropdownItem> */}
                                <DropdownItem
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.handleDelete(item);
                                  }}
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
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
                {this.state.dataLoaded && this.state.user.length < 1 && (
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

export default userTable;
