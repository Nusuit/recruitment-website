import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

// Default chart options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: { size: 10 },
      },
    },
    title: {
      display: true,
      font: { size: 14, weight: "bold" },
    },
    tooltip: {
      bodyFont: { size: 10 },
      titleFont: { size: 12 },
    },
  },
  scales: {
    x: {
      ticks: { font: { size: 10 } },
      grid: { display: false },
    },
    y: {
      ticks: { font: { size: 10 } },
      beginAtZero: true,
    },
  },
}; 