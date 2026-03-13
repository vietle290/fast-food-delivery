import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function SalesChart() {
  const { perDaysWeeklyTotalDeliveredOrders } = useSelector((state) => state.user);
const chartData = (perDaysWeeklyTotalDeliveredOrders || []).map(item => ({
  ...item,
  dayOfWeek: days[item.dayOfWeek - 1]
}));
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full lg:col-span-2">
      <h3 className="font-semibold mb-4">Sales Overview (Weekly)</h3>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="dayOfWeek" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="totalOrders"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
