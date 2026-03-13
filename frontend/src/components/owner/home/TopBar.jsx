export default function TopBar() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* <div className="flex items-center gap-3">
        <input
          className="px-4 py-2 rounded-lg border w-full md:w-64"
          placeholder="Search..."
        />
        <span className="text-green-600 text-sm font-medium">● System Online</span>
      </div> */}
    </div>
  );
}
