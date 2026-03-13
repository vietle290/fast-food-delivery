import React from 'react'
import TopBar from './home/TopBar';
import StatCard from './home/StatCard';
import QuickActions from './home/QuickActions';
import RecentOrders from './home/RecentOrders';
import SalesChart from './home/SalesChart';
import PopularDishes from './home/PopularDishes';
import { useSelector } from 'react-redux';

function OwnerHome() {
  const { totalTodayDeliveredOrder, revenueOrder, activeSellingFood, totalFoodInShop } = useSelector((state) => state.user);
  const { totalActiveOrders } = useSelector((state) => state.owner);
  return (
    <div className="min-h-screen bg-[#FFF9F6] p-4 md:p-6">
      <TopBar />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard title="Today's Orders" value={totalTodayDeliveredOrder || 0} />
        <StatCard title="Revenue" value={`đ ${revenueOrder || 0}`} />
        <StatCard title="Current Selling Food" value={`${activeSellingFood || 0}/${totalFoodInShop || 0}`} />
        <StatCard title="Active Orders" value={totalActiveOrders.totalOrders || 0} />
      </div>

      {/* Actions + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <QuickActions />
        <RecentOrders />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <SalesChart />
        <PopularDishes />
      </div>
    </div>
  );
}

export default OwnerHome
