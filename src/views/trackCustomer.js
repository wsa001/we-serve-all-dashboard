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
import Map from "../components/map/map.jsx";
import authService from "../services/authService.js";
import orderService from "../services/orderService.js";
import toastService from "../services/toastService.js";
import Header from "./../components/Headers/Header.js";

class orderLocation extends Component {
  state = {
    data: [],
    dataLoaded: false,
  };
  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ dataLoaded: false });
    try {
      let data = [];

      const empId = await authService.getCurrentUser()[0]._id;
      const { data: response } = await orderService.getOrderByEmp(empId);
      console.log(response.data);
      response.data.order.forEach((item, index) => data.push(item));

      this.setState({ data: data });
    } catch (ex) {
      toastService.error(ex.message);
    }
    console.log(this.state.data);
    this.setState({ dataLoaded: true });
  }

  render() {
    return (
      <>
        <Header />
        {this.state.data &&
          this.state.data
            .filter((d) => d.status === "in progress")
            .map((item) => (
              <div className="py-4">
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-10 d-flex justify-content-center flex-column">
                      <div className="paymentCard card w-100 shadow-sm">
                        <div
                          style={{
                            "background-color": "#002434",
                            border: "0",
                            padding: ".75rem 1.25rem",
                            display: "flex",
                            "align-items": "center",
                            "justify-content": "space-between",
                          }}
                          className="card-header"
                        >
                          <p
                            style={{
                              "font-size": "14px",
                              color: "#FFFFFF",
                              "font-weight": "700 !important",
                              "margin-bottom": "0 !important",
                            }}
                          >
                            current Order
                          </p>
                        </div>
                        <div
                          className="my-account-content card-body pt-md-5 pr-md-5 pl-md-5"
                          style={{ margin: 0, padding: "5px" }}
                        >
                          <div className="w-100">
                            <div className="text-center">
                              <h4 className="font-weight-bold mb-0">
                                {"Amount: "}
                                {item.servicesDetails.price} RS
                              </h4>

                              <h5
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  padding: "5px",
                                }}
                              >
                                Customer phono No. : {item.phnno}
                              </h5>

                              <h5
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  padding: "5px",
                                }}
                              >
                                Service :{item.servicesDetails.title}
                              </h5>
                              <h5
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  padding: "5px",
                                }}
                              >
                                Payment Method :{item.payment}
                              </h5>
                            </div>
                            <div style={{ height: "40vh", width: "100%" }}>
                              <Map location={item.location}></Map>
                              {/* {
                                <Map
                                  id="map"
                                  userId={item.services.userId}
                                ></Map>
                              } */}
                              {/* <GoogleMap
                                defaultCenter={{
                                  lat: 31.508127,
                                  lng: 73.218366,
                                }}
                                defaultZoom={20}
                                center={{
                                  lat: 31.508127,
                                  lng: 73.218366,
                                }}
                              >
                                <Marker
                                  key={"1"}
                                  text={"name"}
                                  lat={31.508127}
                                  lng={73.218366}
                                />
                              </GoogleMap> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </>
    );
  }
}

export default orderLocation;
