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
import { geolocated } from "react-geolocated";
import prviderLocationservice from "../services/providerLoctionServices";
import Location from "./location";
class serviceTable extends Component {
  state = {
    service: [],
    dataLoaded: false,
  };

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ dataLoaded: false });
    try {
      const { data: response } = await servicesService.getServices();
      console.log(response.data.service);
      if (response.data.service) {
        let service = [];
        response.data.service.forEach((item, index) => {
          if (this.userRole.role === "admin") {
            service.push(item);
          } else if (
            this.userRole.role === "employee" &&
            item.userId === authService.getCurrentUser()[0]._id
          ) {
            service.push(item);
          }
        });
        this.setState({ service: service });
      }
    } catch (ex) {
      toastService.error(ex.message);
    }
    this.setState({ dataLoaded: true });
  }

  handleAdd = () => {
    Location.AddLocation();
    this.props.history.push("/dashboard/services/add");
  };

  handleEdit = (servicesData) => {
    this.props.history.push(`/dashboard/services/${servicesData._id}/edit`);
  };

  handleDelete = (servicesData) => {
    try {
      alertService
        .show({
          title: "Are you sure?",
          text: `Do you want to delete Service "${servicesData.title}"`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            let response = servicesService.deleteService(servicesData._id);
            response
              .then((res) => {
                console.log(res);
                const service = this.state.service.filter(
                  (s) => s._id !== res.data.data.service._id
                );
                this.setState({ service: service });
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
                      <h3 className="mb-0">Service</h3>
                    </div>
                    <div className="col text-right">
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
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Catagory</th>
                      <th scope="col">Price</th>
                      <th scope="col">Rating</th>
                      <th scope="col">Approved</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.service &&
                      this.state.service.map((item) => (
                        <tr key={item.id}>
                          <th scope="row">
                            <Media className="align-items-center">
                              <Media>
                                <span className="mb-0 text-sm">
                                  {item.title}
                                </span>
                              </Media>
                            </Media>
                          </th>
                          <td>{item.catagory}</td>
                          <td>{item.price}</td>
                          <td>{item.rating}</td>

                          <td>{item.approved.toString()}</td>
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
                                <DropdownItem
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.handleEdit(item);
                                  }}
                                >
                                  Edit
                                </DropdownItem>
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
                {this.state.dataLoaded && this.state.service.length < 1 && (
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

export default serviceTable;
