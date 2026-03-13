import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();
  

  const handleNavigateAddFood = () => {
    navigate("/add-item");
  };
  const handleNavigateMyOrders = () => {
    navigate("/my-orders");
  };
  const handleNavigateChat = () => {
    navigate("/chat");
  };
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold mb-4">Quick Actions</h3>

      <div className="space-y-3">
        <button onClick={handleNavigateMyOrders} className="w-full bg-blue-500 text-white py-2 rounded-lg">
          My Orders
        </button>
        <button onClick={handleNavigateAddFood} className="w-full bg-green-500 text-white py-2 rounded-lg">
          Add Food
        </button>
        <button onClick={handleNavigateChat} className="w-full bg-purple-500 text-white py-2 rounded-lg">
          Chat
        </button>
      </div>
    </div>
  );
}
