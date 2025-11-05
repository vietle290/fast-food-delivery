import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AddCategory from "./AddCategory";
import CustomTable from "../CustomTable";
import UpdateCategory from "./UpdateCategory";
import DeleteCategory from "./DeleteCategory";
import axios from "axios";
import { serverUrl } from "../../App";
import { setCategoryies, setSearchCategories } from "../../redux/slice/userSlice";
import { useEffect } from "react";

function CategoryList() {
  const dispatch = useDispatch();
  const searchCategories = useSelector((state) => state.user.searchCategories);
  const categories = useSelector((state) => state.user.categories);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editCategory, setEditCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [query, setQuery] = useState("");
  const itemsPerPage = 3;
  const displayCategories = searchCategories.length > 0 ? searchCategories : categories;
  const totalPages = Math.ceil(displayCategories.length / itemsPerPage);
  const paginatedCategories = displayCategories.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

const handleSelectAll = () => {
  setSelectedIds(
    selectedIds.length === paginatedCategories.length
      ? []
      : paginatedCategories.map((c) => c._id)
  );
};


  // const handleSelectAllSearch = () => {
  //   setSelectedIds(
  //     selectedIds.length === paginatedCategoriesSearch.length
  //       ? []
  //       : paginatedCategoriesSearch.map((c) => c._id)
  //   );
  // };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("No categories selected.");
    setCategoryToDelete({ _id: selectedIds });
  };

  const handleSearch = async (e) => {
    try {
      const res = await axios.get(`${serverUrl}/api/category/search-category?query=${query}`, {
        withCredentials: true,
      });
      dispatch(setCategoryies([]));
      dispatch(setSearchCategories(res.data));
    } catch (error) {
      console.error("Error searching categories:", error);
    }
  }

  // Cấu hình cột cho bảng
  const columns = [
    {
      header: "Image",
      render: (cat) => (
        <img
          src={cat.image}
          alt={cat.name}
          className="w-14 h-14 rounded-lg object-cover border border-gray-100 shadow-sm"
        />
      ),
    },
    { header: "Name", accessor: "name" },
    { header: "Shop ID", accessor: "shop" },
    {
      header: "Created At",
      render: (cat) => new Date(cat.createdAt).toLocaleDateString("en-GB"),
    },
  ];

  useEffect(() => {
    if (query.trim().length > 0) {
      handleSearch();
    } else {
      dispatch(setSearchCategories([]));
    }
  }, [query, dispatch]);
  

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <div className="flex justify-center">
          <div className="flex gap-3 items-center">
            <h2 className="text-xl font-semibold text-gray-700">Categories</h2>
            <input
              type="text"
              placeholder="Search categories..."
              className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent w-full max-w-xs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

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
      <CustomTable
        columns={columns}
        data={paginatedCategories}
        // searchCategories={paginatedCategoriesSearch}
        selectable
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        // onSelectAllSearch={handleSelectAllSearch}
        onSelectRow={handleSelectRow}
        renderActions={(cat) => (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setEditCategory(cat)}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => setCategoryToDelete(cat)}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition"
            >
              <FaTrash />
            </button>
          </div>
        )}
      />

      {/* Pagination */}
      <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </p>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setCurrentPage(page)}
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
      {editCategory && (
        <UpdateCategory
          category={editCategory}
          onClose={() => setEditCategory(null)}
        />
      )}
      {categoryToDelete && (
        <DeleteCategory
          category={categoryToDelete}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onClose={() => setCategoryToDelete(null)}
        />
      )}
    </div>
  );
}

export default CategoryList;
