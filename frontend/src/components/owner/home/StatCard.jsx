export default function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
