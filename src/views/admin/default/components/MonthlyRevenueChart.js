import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

const MonthlyRevenueChart = () => {
    const tree = useSelector((state) => state.user.tree); 
  const [state, setState] = useState({
    series: [
      {
        name: tree && ( tree?.hasOwnProperty("managers") && tree["managers"][0]?.firstName + " " + (tree?.hasOwnProperty("managers") && tree["managers"][0]?.lastName)),
        data: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        name: tree && (tree?.hasOwnProperty("managers") && tree["managers"][1]?.firstName + " " + (tree?.hasOwnProperty("managers") && tree["managers"][1]?.lastName)),
        data: [2, 4, 6, 8, 10, 12, 8],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      colors: ["#B79045", "#E5B668"],
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });
  return (
    <>
      <div>
        <div id="chart">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    </>
  );
};

export default MonthlyRevenueChart;
