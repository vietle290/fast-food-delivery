import React, { useRef } from "react";
import Nav from "../Nav";
// import { categories } from "../category";
import CategoryCard from "../category/CategoryCard";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import FoodCard from "../FoodCard";
import { useNavigate } from "react-router-dom";
import image16 from "../../assets/image16.jpg"

function UserDashboard() {
  const { location, shopInCity, loading, itemInCity, searchItems, categories } =
    useSelector((state) => state.user);
  const scrollRef = useRef(null);
  const shopScrollRef = useRef(null);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const [showShopScrollLeft, setShowShopScrollLeft] = useState(false);
  const [showShopScrollRight, setShowShopScrollRight] = useState(false);
  const [filterItems, setFilterItems] = useState([]);
  const navigate = useNavigate();

  const newCategories = [
    {
      _id: "All",
      name: "All",
      image: image16,
    },
    ...categories,
  ];

const handleFilterByCategory = (category) => {
  if (category === "All") {
    setFilterItems(itemInCity.filter((item) => item.sell === true));
  } else {
    setFilterItems(
      itemInCity.filter(
        (item) =>
          item.category?.name === category &&
          item.sell === true
      )
    );
  }
};


  useEffect(() => {
    handleFilterByCategory("All");
  }, [itemInCity]);
  const handleScroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };
  const updateButton = (ref, setLeftButton, setRightButton) => {
    if (ref.current) {
      const scrollLeft = ref.current.scrollLeft;
      const scrollWidth = ref.current.scrollWidth;
      const clientWidth = ref.current.clientWidth;
      setLeftButton(scrollLeft > 0);
      setRightButton(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    const shopScrollElement = shopScrollRef.current;
    if (scrollElement) {
      const handleScroll = () => {
        updateButton(scrollRef, setShowScrollLeft, setShowScrollRight);
      };
      const handleShopScroll = () => {
        updateButton(
          shopScrollRef,
          setShowShopScrollLeft,
          setShowShopScrollRight
        );
      };
      updateButton(scrollRef, setShowScrollLeft, setShowScrollRight);
      updateButton(
        shopScrollRef,
        setShowShopScrollLeft,
        setShowShopScrollRight
      );
      scrollElement.addEventListener("scroll", handleScroll);
      shopScrollElement.addEventListener("scroll", handleShopScroll);
      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
        shopScrollElement.removeEventListener("scroll", handleShopScroll);
      };
    }
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center gap-5 bg-[#FFF9F6] overflow-y-auto">
      <Nav />
      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-7xl gap-5 flex flex-col items-start p-[10px] bg-white">
          <h1 className="text-xl text-gray-800 sm:text-2xl font-medium">
            Search Results
          </h1>
          <div className="w-full flex gap-4 overflow-x-auto pb-2">
            <div className="flex gap-4 w-full px-1">
              {searchItems.map((item, index) => (
                <FoodCard item={item} key={index} />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-7xl gap-5 flex flex-col items-start p-[10px]">
        <h1 className="text-xl text-gray-800 sm:text-2xl font-medium">
          Fast Food Categories
        </h1>

        {/* Horizontal Scroll Wrapper */}
        <div className="flex w-full">
          {showScrollLeft && (
            <button onClick={() => handleScroll(scrollRef, "left")}>
              <IoIosArrowDropleftCircle size={30} className="text-[#F59E0B]" />
            </button>
          )}

          <div
            className="w-full flex gap-4 overflow-x-auto pb-2"
            ref={scrollRef}
          >
            <div className="flex gap-4 w-full px-1">
              {newCategories.map((category, index) => (
                <CategoryCard
                  key={index}
                  name={category.name}
                  image={category.image}
                  onClick={() => handleFilterByCategory(category.name)}
                />
              ))}
            </div>
          </div>
          {showScrollRight && (
            <button onClick={() => handleScroll(scrollRef, "right")}>
              <IoIosArrowDroprightCircle size={30} className="text-[#F59E0B]" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-7xl gap-5 flex flex-col items-start p-[10px]">
        <h1 className="text-xl text-gray-800 sm:text-2xl font-medium">
          Best Shops in {location}
        </h1>
        {loading && <ClipLoader color="#F59E0B" size={30} />}
        <div className="flex w-full">
          {showShopScrollLeft && (
            <button onClick={() => handleScroll(shopScrollRef, "left")}>
              <IoIosArrowDropleftCircle size={30} className="text-[#F59E0B]" />
            </button>
          )}

          <div
            className="w-full flex gap-4 overflow-x-auto pb-2"
            ref={shopScrollRef}
          >
            <div className="flex gap-4 w-full px-1">
              {shopInCity?.map((shops, index) => (
                <CategoryCard
                  key={index}
                  name={shops.name}
                  image={shops.image}
                  onClick={() => navigate(`/shop/${shops._id}`)}
                />
              ))}
            </div>
          </div>
          {showShopScrollRight && (
            <button onClick={() => handleScroll(shopScrollRef, "right")}>
              <IoIosArrowDroprightCircle size={30} className="text-[#F59E0B]" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-7xl gap-5 flex flex-col items-start p-[10px]">
        <h1 className="text-xl text-gray-800 sm:text-2xl font-medium">
          Suggestions Food For You
        </h1>
        <div className="flex flex-wrap gap-4 w-full h-auto justify-center">
          {filterItems?.map((food, index) => (
            <FoodCard key={index} item={food} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
