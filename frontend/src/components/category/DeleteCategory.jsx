import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setCategoryies } from '../../redux/slice/userSlice';
import { serverUrl } from '../../App';

function DeleteCategory({ onClose, category, selectedIds, setSelectedIds }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleDelete = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/category/delete-category/${category._id}`, { withCredentials: true });
            console.log("Deleted Category:", res.data);
            dispatch(setCategoryies(res.data));
            setSelectedIds([]);
            setLoading(false);
            onClose(); 
        } catch (error) {
            console.error(error);
            setSelectedIds([]);
            setError(
                error?.response?.data?.message || "Error deleting category. Try again."
            );
            setLoading(false);
        }
    }

  const handleDeleteMultiple = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/category/delete-multiple-categories`,
        { categoryIds: selectedIds },
        { withCredentials: true }
      );

      dispatch(setCategoryies(res.data));
      setSelectedIds([]);
      onClose();
    } catch (error) {
      console.error(error);
      setError(
        error?.response?.data?.message ||
          "Error deleting multiple categories. Try again."
      );
    } finally {
      setLoading(false);
    }
  };
        
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {selectedIds?.length > 1
            ? "Delete Multiple Categories"
            : "Delete Category"}
        </h2>
        <p className="text-gray-600 mb-4">
          {selectedIds?.length > 1
            ? `Are you sure you want to delete ${selectedIds.length} selected categories?`
            : "Are you sure you want to delete this category?"}
        </p>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="flex justify-end">
          <button
            className="bg-gray-400 text-white py-2 px-4 rounded-md mr-2"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-[#F59E0B] text-white py-2 px-4 rounded-md"
            onClick={
              selectedIds?.length > 1 ? handleDeleteMultiple : handleDelete
            }
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteCategory
