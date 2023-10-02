import React from "react";
import { getOrderStats } from "../../service/order.service";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { Box, Grid } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Orders Received in Last 7 Days",
    },
  },
  maintainAspectRatio: true,
  animation: {
    duration: 0,
  },
};

class OrderReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stats: {},
      pageMargin: null,
      pageHeight: null,
      pageWidth: null,
      dailyOrdersChartData: {
        labels: [],
        datasets: [],
      },
      orderTypesChartData: {
        labels: [],
        datasets: [],
      },
      weeklyRevenue: 0,
    };
  }

  componentDidMount() {
    this.getOrderStatistics(this.props.pharmacyId);
    this.setState({ pageMargin: this.props.pageMargin });
    this.setState({ pageHeight: this.props.pageHeight });
    this.setState({ pageWidth: this.props.pageWidth });
  }

  getOrderStatistics = async (pharmacyId) => {
    this.props.setIsLoading(true);
    const response = await getOrderStats(pharmacyId);
    if (response.success) {
      this.state.stats = response.data;
      const dailyOrders = response?.data?.dailyOrders;

      if (dailyOrders) {
        const labels = [];
        const data = [];
        console.log(dailyOrders);
        for (const order of dailyOrders) {
          labels.push(order.day);
          data.push(order.orderCount);
        }

        this.setState({
          dailyOrdersChartData: {
            labels: labels.reverse(),
            datasets: [
              {
                label: "Orders",
                data: data.reverse(),
                borderColor: "rgb(31, 122, 140)",
                backgroundColor: "rgba(31, 122, 140, 0.5)",
              },
            ],
          },
        });

        this.setState({
          orderTypesChartData: {
            labels: ["Pending", "Confirmed", "Completed", "Cancelled"],
            datasets: [
              {
                label: "Recieved Orders",
                data: [
                  response?.data?.pendingOrders,
                  response?.data?.confirmedOrders,
                  response?.data?.completedOrders,
                  response?.data?.cancelledOrders,
                ],
                backgroundColor: [
                  "rgba(255, 99, 132)",
                  "rgba(54, 162, 235)",
                  "rgba(255, 206, 86)",
                  "rgba(75, 192, 192)",
                ],
                borderColor: [
                  "rgba(255, 99, 132)",
                  "rgba(54, 162, 235)",
                  "rgba(255, 206, 86)",
                  "rgba(75, 192, 192)",
                ],
              },
            ],
          },
        });

        this.setState({ weeklyRevenue: response?.data?.weeklyRevenue });
      }
    } else {
      console.log(response?.data);
    }
    this.props.setIsLoading(false);
  };

  getPageMargins = () => {
    return `@page { margin: ${this.state.pageMargin}; }`;
  };

  getPageSize = () => {
    return `@page { size: ${this.state.pageWidth} ${this.state.pageHeight};}`;
  };

  render() {
    return (
      <div>
        <style>
          {this.getPageSize()}
          {this.getPageMargins()}
        </style>
        <div
          className="container"
          style={{ padding: "0 10mm 0 0mm", fontSize: "6mm" }}
        >
          <center>
            <h2>Weekly Order Summary</h2>
            <div style={{ height: "auto", width: "600px" }}>
              <Line options={options} data={this.state.dailyOrdersChartData} />
            </div>
          </center>
          <br />
          <br />
          <Grid container>
            <Grid item xs={8}>
              <div style={{ height: "100%", width: "400px" }}>
                <Pie options={options} data={this.state.orderTypesChartData} />
              </div>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ pl: 3, pt: 4 }}>
                <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  Weekly Revenue
                </span>
                <br />
                {this.state.weeklyRevenue
                  ? `Rs.${this.state.weeklyRevenue.toLocaleString("en-US")}`
                  : "No Revenue"}
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default OrderReport;
