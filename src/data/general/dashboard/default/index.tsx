import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { Href } from "@/constants";
import { ApexOptions } from "apexcharts";

export const EarningChartOptions: ApexOptions = {
  series: [
    {
      name: "Net Profit",
      data: [90, 40, 114, 56, 90, 80, 90],
    },
    {
      name: "Revenue",
      data: [60, 75, 90, 80, 61, 30, 70],
    },
  ],
  chart: {
    type: "bar",
    height: 290,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: "40%",
    },
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    position: "back",
    xaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: false,
    width: 0,
  },
  xaxis: {
    categories: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  colors: ["var(--theme-default)", "#f99b0d"],
  legend: {
    show: false,
  },
  responsive: [
    {
      breakpoint: 1531,
      options: {
        chart: {
          height: 255,
        },
      },
    },
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 272,
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        chart: {
          height: 265,
        },
      },
    },
    {
      breakpoint: 963,
      options: {
        chart: {
          height: 272,
        },
      },
    },
  ],
};

export const UserCardData = [
  {
    svg: "crown",
    heading: "User Profile",
    title: "Consectetur adipiscing ",
    color: "primary",
  },
  {
    svg: "flash",
    heading: "Latest Trends",
    title: "Minim veniam",
    color: "success",
  },
  {
    svg: "blend-2",
    heading: "New Arrivals",
    title: "Excepteur sint",
    color: "warning",
  },
  {
    svg: "color-filter",
    heading: "Best Referrals",
    title: "Quis nostrud exercitation",
    color: "secondary",
  },
];

export const RevenueChartOptions: ApexOptions = {
  series: [
    {
      name: "Sales",
      data: [5, 25, 3, 20, 15],
    },
    {
      name: "Revenue",
      data: [5, 15, 3, 14, 15],
    },
  ],
  chart: {
    height: 140,
    type: "line",
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: 2,
    curve: "smooth",
  },
  xaxis: {
    type: "category",
    categories: ["Sat", "Sun", "Mon", "Tue", "Wed"],
    tickAmount: 6,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: ["var(--body-light-font-color)"],
      },
    },
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    strokeDashArray: 6,
    position: "back",
  },
  colors: ["#80be70", "#c8e7e5"],
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      gradientToColors: ["#029eb4"],
      shadeIntensity: 1,
      type: "horizontal",
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100, 100, 100],
    },
  },
  legend: {
    show: false,
  },
  yaxis: {
    min: 0,
    max: 30,
    tickAmount: 3,
  },
};

export const SalesPipelineChartOptions: ApexOptions = {
  series: [10, 60, 30],
  labels: ["Store", "Ad", "Search"],
  chart: {
    width: 290,
    height: 290,
    type: "donut",
  },
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 270,
      donut: {
        labels: {
          show: true,
          name: {
            offsetY: 4,
          },
          total: {
            show: true,
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            label: "88%",
            color: "#000",
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["#f99b0d", "#009DB5", "#7fbe71"],
  fill: {
    type: "gradient",
  },
  legend: {
    formatter: function (val, opts) {
      return val + " - " + opts.w.globals.series[opts.seriesIndex];
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 1750,
      options: {
        chart: {
          offsetX: 10,
        },
        legend: {
          show: false,
        },
      },
    },
    {
      breakpoint: 1800,
      options: {
        chart: {
          width: 154,
          height: 154,
          offsetX: 40,
        },
        legend: {
          show: false,
        },
      },
    },
  ],
};

export const RevenueSliderData = [
  {
    percentage: "45%",
    text: "Facebook",
    icon: <i className="txt-primary fa fa-facebook-square me-1" />,
    class: "progress progress-stripe-primary with-light-background mt-2",
  },
  {
    percentage: "70%",
    text: "Instagram",
    icon: <i className="txt-secondary fa fa-instagram me-1" />,
    class: "progress progress-stripe-secondary with-light-background mt-2",
  },
  {
    percentage: "30%",
    text: "Twitter",
    icon: <i className="txt-success fa fa-twitter me-1" />,
    class: "progress progress-stripe-success with-light-background mt-2",
  },
];

export const ProfitChartOptions: any = {
  series: [
    {
      name: "Income",
      type: "line",
      data: [60, 80, 30, 60, 30, 90],
    },
    {
      name: "Earnings",
      type: "line",
      data: [55, 65, 55, 80, 40, 65],
    },
    {
      name: "Profit",
      type: "line",
      data: [50, 40, 70, 40, 100, 70],
    },
  ],
  chart: {
    height: 255,
    type: "line",
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 4,
      left: 0,
      blur: 2,
      colors: ["var(--theme-default)", "#83BF6E", "#F99B0D"],
      opacity: 0.02,
    },
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    strokeDashArray: 6,
    position: "back",
    xaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  colors: ["var(--theme-default)", "#83BF6E", "#F99B0D"],
  stroke: {
    width: 3,
    curve: "smooth",
    opacity: 1,
  },
  markers: {
    discrete: [
      {
        seriesIndex: 1,
        dataPointIndex: 3,
        fillColor: "#54BA4A",
        strokeColor: "var(--white)",
        size: 6,
      },
    ],
  },
  tooltip: {
    shared: false,
    intersect: false,
    marker: {
      width: 5,
      height: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: ["Jan 02", "Jan 05", "Jan 08", "Jan 11", "Jan 14", "Jan 17"],
    min: 0.9,
    max: undefined,
    crosshairs: {
      show: false,
    },
    labels: {
      style: {
        colors: "var(--chart-text-color)",
        fontSize: "12px",
        fontFamily: "Rubik, sans-serif",
        fontWeight: 400,
      },
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    opacity: 1,
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      shadeIntensity: 1,
      opacityFrom: 0.95,
      opacityTo: 1,
      stops: [0, 90, 100],
    },
  },
  yaxis: {
    tickAmount: 5,
  },
  legend: {
    show: false,
  },
  responsive: [
    {
      breakpoint: 651,
      options: {
        chart: {
          height: 210,
        },
      },
    },
  ],
};

export const UpcomingTransactionData = [
  {
    text: "Income : Salary Oct",
    color: "bg-light-success",
    amount: "+$1200",
    icon: "payment",
  },
  {
    text: "Electric Bill",
    color: "bg-light-warning",
    amount: "-$191",
    icon: "invoice",
  },
  {
    text: "Income : Jane transfers",
    color: "bg-light-secondary",
    amount: "+$540",
    icon: "transfer",
  },
];

export const TopReferralWebsiteData = [
  {
    color: "primary",
    website: "www.google.com",
    percentage: "35.89%",
  },
  {
    color: "success",
    website: "www.youtube.com",
    percentage: "19.12%",
  },
  {
    color: "warning",
    website: "www.media.com",
    percentage: "14.75%",
  },
  {
    color: "secondary",
    website: "www.pixelstarp.com",
    percentage: "19.76%",
  },
  {
    color: "secondary",
    website: "www.facebook.com",
    percentage: "18.98%",
  },
];

export const TopReferralProgressData = [
  {
    width: "30%",
    color: "primary",
  },
  {
    width: "20%",
    color: "success",
  },
  {
    width: "15%",
    color: "warning",
  },
  {
    width: "15%",
    color: "secondary",
  },
  {
    width: "30%",
    color: "info",
  },
];

export const CommonOrderDropdown = () => {
  return (
    <div className="dropdown icon-dropdown">
      <button
        className="btn dropdown-toggle"
        id="order-1"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <svg>
          <use href="../../assets/svg/icon-sprite.svg#more-horizontal" />
        </svg>
      </button>
      <div
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="order-1"
      >
        <a className="dropdown-item" href="cart.html">
          Add to cart
        </a>
        <a className="dropdown-item" href="#">
          Cancel
        </a>
      </div>
    </div>
  );
};

export const RecentOrdersData = [
  {
    image: "1.png",
    item: "Apple PC",
    code: "#10988",
    quantity: "3 Item",
    price: "$5,098",
  },
  {
    image: "2.png",
    item: "T-Shirts",
    code: "#10980",
    quantity: "2 Item",
    price: "$6,010",
  },
  {
    image: "3.png",
    item: "Macbook",
    code: "#101098",
    quantity: "5 Item",
    price: "$12,000",
  },
  {
    image: "4.png",
    item: "Shoes",
    code: "#101098",
    quantity: "3 Item",
    price: "$2,000",
  },
  {
    image: "5.png",
    item: "Wall Watch",
    code: "#101098",
    quantity: "1 Item",
    price: "$2,000",
  },
];

export const TodoListData = [
  {
    heading: "Products",
    time: "Today 2:00pm Clock",
    status: "In Progress",
    color: "primary",
  },
  {
    heading: "Web developing..",
    time: "Due in 4 Days",
    status: "pending",
    color: "warning",
  },
  {
    heading: "UI/UX Design ",
    time: "Due in 3 Days",
    status: "Completed",
    color: "success",
  },
  {
    heading: "Client Meeting ..",
    time: "Today 1:00pm Clock",
    status: "In Progress",
    color: "primary",
  },
  {
    heading: "Web Layout..",
    time: "Due in 10 Days",
    status: "Completed",
    color: "success",
  },
  {
    heading: "Web developing..",
    time: "Due in 4 Days",
    status: "Pending",
    color: "warning",
  },
  {
    heading: "UI/UX Design",
    time: "Due in 3 Days",
    status: "Completed",
    color: "success",
  },
];

export const MembersData = [
  {
    id: 1,
    color: "success",
    checkboxId: "checkbox-2",
    author: {
      name: "Jerome Bell",
      role: "UX designer",
      image: "3.jpg",
    },
    company: "Louis",
    progress: 70,
  },
  {
    id: 2,
    color: "warning",
    checkboxId: "checkbox-3",
    author: {
      name: "Ralph Edwa",
      role: "Web, Laravel",
      image: "4.jpg",
    },
    company: "IBM",
    progress: 50,
  },
  {
    id: 3,
    color: "primary",
    checkboxId: "checkbox-4",
    author: {
      name: "Esther Kit",
      role: "Laravel",
      image: "5.jpg",
    },
    company: "Johnson",
    progress: 83,
  },
  {
    id: 4,
    color: "secondary",
    checkboxId: "checkbox-5",
    author: {
      name: "Leslie Jolly",
      role: "Designer",
      image: "1.png",
    },
    company: "Card",
    progress: 79,
  },
];

export const DeleteEditIcon = (
  <div className="d-flex action-buttons">
    <a className="light-card" href={Href}>
      <SvgIcon iconId="edit-2" />
    </a>
    <a className="light-card" href={Href}>
      <SvgIcon iconId="trash-fill" />
    </a>
  </div>
);

export const TotalTransactionChartOptions: ApexOptions = {
  series: [
    {
      name: "transaction",
      data: [1.5, 2.1, 2.9, 3.8, 3.2, 2.1],
    },
    {
      name: "traffic",
      data: [-1.4, -2.2, -2.85, -3.7, -3, -2.2],
    },
  ],
  chart: {
    type: "bar",
    height: 200,
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  colors: ["#83BF6E", "var(--theme-default)"],
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "40%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
  },

  grid: {
    borderColor: "var(--chart-border)",
    strokeDashArray: 2,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  yaxis: {
    min: -5,
    max: 5,
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
  xaxis: {
    categories: ["85+", "80-84", "75-79", "70-74", "65-69", "60-64"],
    position: "top",
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
  legend: {
    show: false,
  },

  responsive: [
    {
      breakpoint: 1441,
      options: {
        chart: {
          height: 180,
        },
      },
    },
  ],
};
