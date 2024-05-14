<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: "BarChart",
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: ["January", "February", "March"],
        datasets: [
          {
            label: "DataSet1",
            data: [40, 20, 12],
            backgroundColor: "#FF0000",
          },
          {
            label: "DataSet2",
            data: [21, 12, 31],
            backgroundColor: "#7393B3",
          },
          {
            label: "DataSet3",
            data: [97, 70, 15],
            backgroundColor: "#355E3B",
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },
};
</script>
