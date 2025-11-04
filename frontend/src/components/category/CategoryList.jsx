import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AddCategory from "./AddCategory";

function CategoryList() {
  const categories = useSelector((state) => state.user.categories);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedCategories = categories.slice(indexOfFirst, indexOfLast);

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedCategories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedCategories.map((cat) => cat._id));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("No categories selected.");
    alert(`Deleted ${selectedIds.length} category(ies)!`);
    setSelectedIds([]);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleGoToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold text-gray-700">Categories</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#FBBF24] text-white rounded-md transition"
          >
            <FaPlus /> Create Category
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded-md font-medium text-white transition ${
              selectedIds.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Delete Selected ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#FFF9F6]">
            <tr className="text-left text-sm font-semibold text-gray-600 uppercase">
              <th className="px-4 py-3 w-[50px] text-center align-middle">
                <div className="flex justify-center items-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === paginatedCategories.length &&
                      paginatedCategories.length > 0
                    }
                    onChange={handleSelectAll}
                    className="cursor-pointer w-4 h-4 accent-[#F59E0B]"
                  />
                </div>
              </th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Shop ID</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCategories.map((cat) => (
              <tr
                key={cat._id}
                className={`${
                  selectedIds.includes(cat._id)
                    ? "bg-[#FFF4E5]"
                    : "hover:bg-[#FFF9F6]"
                }`}
              >
                <td className="px-4 py-3 w-[50px] text-center align-middle">
                  <div className="flex justify-center items-center h-full">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(cat._id)}
                      onChange={() => handleSelectRow(cat._id)}
                      className="cursor-pointer w-4 h-4 accent-[#F59E0B]"
                    />
                  </div>
                </td>
                <td className="px-6 py-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-14 h-14 rounded-lg object-cover border border-gray-100 shadow-sm"
                  />
                </td>
                <td className="px-6 py-3 text-gray-700 font-medium">
                  {cat.name}
                </td>
                <td className="px-6 py-3 text-gray-500">{cat.shop}</td>
                <td className="px-6 py-3 text-gray-500">
                  {new Date(cat.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-3 text-center flex justify-center gap-3">
                  <button className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition">
                    <FaEdit />
                  </button>
                  <button className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {paginatedCategories.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </p>

        <div className="flex gap-1 items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-2 border rounded-md font-medium transition ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-[#FFF4E5] border-gray-300"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handleGoToPage(page)}
              className={`px-3 py-2 rounded-md font-medium border transition ${
                currentPage === page
                  ? "bg-[#F59E0B] text-white border-[#F59E0B]"
                  : "bg-white text-gray-700 hover:bg-[#FFF4E5] border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-2 border rounded-md font-medium transition ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-[#FFF4E5] border-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && <AddCategory onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default CategoryList;
