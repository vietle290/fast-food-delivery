import React from "react";

function CustomTable({
  columns = [],
  data = [],
  selectable = false,
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  renderActions,
}) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="bg-white shadow-md rounded-xl overflow-x-auto border border-gray-200">
      <table className="min-w-max w-full divide-y divide-gray-200">
        {/* Header */}
        <thead className="bg-[#FFF9F6]">
          <tr className="text-left text-sm font-semibold text-gray-600 uppercase">
            {selectable && (
              <th className="px-4 py-3 w-[50px] text-center align-middle">
                <div className="flex justify-center items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onSelectAll}
                    className="cursor-pointer w-4 h-4 accent-[#F59E0B]"
                  />
                </div>
              </th>
            )}

            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3">
                {col.header}
              </th>
            ))}

            {renderActions && <th className="px-6 py-3 text-center">Actions</th>}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length + (selectable ? 1 : 0) + (renderActions ? 1 : 0)
                }
                className="text-center py-6 text-gray-500 font-medium"
              >
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row._id}
                className={`${
                  selectedIds.includes(row._id)
                    ? "bg-[#FFF4E5]"
                    : "hover:bg-[#FFF9F6]"
                }`}
              >
                {selectable && (
                  <td className="px-4 py-3 w-[50px] text-center align-middle">
                    <div className="flex justify-center items-center h-full">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row._id)}
                        onChange={() => onSelectRow(row._id)}
                        className="cursor-pointer w-4 h-4 accent-[#F59E0B]"
                      />
                    </div>
                  </td>
                )}

                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-3 text-gray-700">
                    {typeof col.render === "function"
                      ? col.render(row)
                      : row[col.accessor]}
                  </td>
                ))}

                {renderActions && (
                  <td className="px-6 py-3 text-center">{renderActions(row)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable;
