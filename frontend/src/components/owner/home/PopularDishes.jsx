import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#9ca3af"];

export default function PopularDishes() {
  const { popularDishes } = useSelector((state) => state.user);
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full">
      <h3 className="font-semibold mb-4">Popular Dishes</h3>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={popularDishes}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {popularDishes?.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
