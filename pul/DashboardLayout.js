import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import DashboardNavbar from "../components/Navbars/DashboardNavbar.js";
import DashboardFooter from "../components/Footers/DashboardFooter.js";
import DashboardSidebar from "../components/Sidebar/DashboardSidebar.js";

import routes from "./../routes";
import DashboardIndex from "../views/DashboardIndex";
import authService from "../services/authService";
import Profile from "../views/Profile";
import ServiceForm from "../views/ServicesForm.js";
import ServiceTable from "../views/ServiceTable.js";
import userTable from "../views/UserTable.js";
import userForm from "../views/UserForm.js";
import orderTable from "../views/OrderTable.js";
const DashboardLayout = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/dashboard") {
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

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      {!authService.getCurrentUser() && <Redirect to="/auth" />}
      <DashboardSidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/dashboard/index",
          imgSrc: require("../assets/img/brand/project-logo.png").default,
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <DashboardNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
        />
        <Switch>
          <Route path="/dashboard/index" exact component={DashboardIndex} />
          {/* <Route path="/dashboard/tenants" exact component={TenantTable} />
          <Route path="/dashboard/tenants/add" exact component={TenantForm} />
          <Route
            path="/dashboard/tenants/:tenantId/edit"
            exact
            component={TenantForm}
          />
          <Route
            path="/dashboard/network-servers"
            exact
            component={NetworkServerTable}
          />
          <Route
            path="/dashboard/network-servers/add"
            exact
            component={NetworkServerForm}
          />
          <Route
            path="/dashboard/network-servers/:nasId/edit"
            exact
            component={NetworkServerForm}
          />
          <Route path="/dashboard/packages" exact component={PackageTable} /> */}
          {/* <Route path="/dashboard/packages/add" exact component={PackageForm} />
          <Route
            path="/dashboard/packages/:packageId/edit"
            exact
            component={PackageForm}
          />
          <Route
            path="/dashboard/franchises"
            exact
            component={FranchiseTable}
          />
          <Route
            path="/dashboard/franchises/add"
            exact
            component={FranchiseForm}
          />
          <Route
            path="/dashboard/franchises/:franchiseId/edit"
            exact
            component={FranchiseForm}
          />
          <Route path="/dashboard/dealers" exact component={DealerTable} />
          <Route path="/dashboard/dealers/add" exact component={DealerForm} />
          <Route
            path="/dashboard/dealers/:dealerId/edit"
            exact
            component={DealerForm}
          />
          <Route path="/dashboard/customers" exact component={CustomerTable} />
          <Route
            path="/dashboard/customers/add"
            exact
            component={CustomerForm}
          /> */}
          <Route path="/dashboard/services" exact component={ServiceTable} />
          <Route path="/dashboard/Services/add" exact component={ServiceForm} />
          <Route
            path="/dashboard/services/:serviceId/edit"
            exact
            component={ServiceForm}
          />
          <Route path="/dashboard/orders" exact component={orderTable} />
          {/* <Route path="/dashboard/Services/add" exact component={ServiceForm} />
          <Route
            path="/dashboard/services/:serviceId/edit"
            exact
            component={ServiceForm} */}
          {/* /> */}
          <Route path="/dashboard/users" exact component={userTable} />
          <Route path="/dashboard/users/add" exact component={userForm} />
          <Route
            path="/dashboard/users/:userId/edit"
            exact
            component={userForm}
          />
          <Route path="/dashboard/profile/" exact component={Profile} />
          <Redirect from="*" to="/dashboard/index" />
        </Switch>
        <Container fluid>
          <DashboardFooter />
        </Container>
      </div>
    </>
  );
};

export default DashboardLayout;
