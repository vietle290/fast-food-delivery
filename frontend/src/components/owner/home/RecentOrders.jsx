import { useSelector } from "react-redux";

export default function RecentOrders() {
  const { threeLatestOrderUpdate } = useSelector(state => state.user);
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm lg:col-span-2">
      <h3 className="font-semibold mb-4">Recent Orders</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Order</th>
              <th className="text-left">Customer</th>
              <th>Status</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {threeLatestOrderUpdate?.map(o => (
              <tr key={o._id} className="border-b last:border-none">
                <td className="py-2">Order #{o._id.slice(-6)}</td>
                <td>{o.user?.fullName || "Unknown Customer"}</td>
                <td className="text-center">
                <span
              className={`text-sm font-medium ${
                o.shopOrders[0]?.status === "pending"
                  ? "text-blue-600 bg-blue-50"
                  : o.shopOrders[0]?.status === "preparing"
                  ? "text-orange-600 bg-orange-50"
                  : o.shopOrders[0]?.status === "delivered"
                  ? "text-green-600 bg-green-50"
                  : o.shopOrders[0]?.status === "out-for-delivery"
                  ? "text-yellow-600 bg-yellow-50"
                  : "text-gray-600 bg-gray-50"
              } px-2 py-1 rounded`}
                  >
                    {o.shopOrders[0]?.status}
                  </span>
                </td>
                <td className="text-right">{o.shopOrders[0]?.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
