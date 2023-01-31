var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-indigo",
    layout: "/dashboard",
    accessTo: ["admin", "employee"],
  },

  {
    path: "/services",
    name: "Services",
    icon: "ni ni-box-2 text-yellow",
    layout: "/dashboard",
    accessTo: ["admin", "employee"],
  },
  {
    path: "/orders",
    name: "Orders",
    icon: "ni ni-world-2 text-blue",
    layout: "/dashboard",
    accessTo: ["admin", "employee"],
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni ni-bullet-list-67 text-grey",
    layout: "/dashboard",
    accessTo: ["admin"],
  },
  {
    path: "/order-Location",
    name: "order-Location",
    icon: "ni ni-box-2 text-yellow",
    layout: "/dashboard",
    accessTo: ["employee"],
  },
];
export default routes;
