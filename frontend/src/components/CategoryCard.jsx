import React from "react";

function CategoryCard({ name, image }) {
  return (
    <div className="min-w-[120px] sm:min-w-[250px] max-w-[250px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      {/* Responsive height: h-20 for small screens, h-40 from sm and up */}
      <div className="h-20 sm:h-40 w-full overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      {/* Responsive margin: -40px for small screens, -25px from sm and up */}
      <div className="pl-4 flex flex-col gap-2">
        <h2
          className="text-lg font-semibold text-gray-800 truncate w-full"
          title={name}
        >
          {name}
        </h2>
      </div>
    </div>
  );
}

export default CategoryCard;
