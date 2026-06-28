
// import React from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'

// const FilterSidebar = ({ allProducts , priceRange,setPriceRange, search, setSearch, category, setCategory, brand, setBrand }) => {

//   const Categories = [allProducts.map(p => p.category)]
//   const uniqueCategory = ['All', ...new Set(Categories.flat())]
//   const Brands = allProducts.map(p => p.brand)
//   const uniqueBrand = ['All', ...new Set(Brands)]
//   console.log( uniqueBrand)
  
//   const handelCategoryCLick = (val) => { 
//     setCategory(val)
//   }

//   const handelBrandClick = (e) => {
//     setBrand(e.target.value)
//   } 

//   const handelMinChange = (e) => {
//     const value = Number(e.target.value)
//    if(value <= priceRange[1]) setPriceRange([value, priceRange[1]])
//   }

//   const handelMaxChange = (e) => {
//     const value = Number(e.target.value)
//     if(value >= priceRange[0]) setPriceRange([priceRange[0], value])
//   }

//   const resetFilters = () => {
//     setSearch('')
//     setCategory('All')
//     setBrand('All')
//     setPriceRange([0, 999999])
//   }



//   return (
//     <div className="bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64 ">
      
//       {/* 🔍 Search */}
//       <Input
//         type="text"
//         placeholder="Search..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"
//       />

//       {/* 📂 Category */}
//       <h1 className="mt-5 font-semibold text-xl">Category</h1>
//       <div className="flex flex-col gap-2 mt-3">
//         {uniqueCategory.map((item, index) => (
//           <div key={index} className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="category"
//               checked={category === item}
//               onChange={() => handelCategoryCLick(item)}
//             />
//             <Label>{item}</Label>
//           </div>
//         ))}
//       </div>

//       {/* 🏷 Brand */}
//       <h1 className="mt-5 font-semibold text-xl">Brand</h1>
//       <select 
//         className="bg-white w-full p-2 border-gray-200 border-2 rounded-md"
//         value={brand} 
//         onChange={handelBrandClick}
//       >
//         {uniqueBrand.map((item, index) => (
//           <option key={index} value={item}>{item.toUpperCase()}</option>
//         ))}
//       </select>

//       {/* 💰 Price Range */}
//       <h1 className="mt-5 font-semibold text-xl mb-3">Price Range</h1>
//       <div className="flex flex-col gap-2">
        
//         <Label>
//           Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
//         </Label>

//         <div className="flex gap-2 items-center">
//           <input
//             type="number"
//             min="0"
//             max="5000"
//             className="w-20 p-1 border border-gray-300 rounded"
//               value={priceRange[0]}
//               onChange={handelMinChange}
//           />
//           <span>-</span>
//           <input
//             type="number"
//             min="0"
//             max="999999"
//             className="w-20 p-1 border border-gray-300 rounded"
//               value={priceRange[1]}
//               onChange={handelMaxChange}
//           />
//         </div>

//         <input
//           type="range"
//           min="0"
//           max="5000"
//           step="100"
//           className="w-full"
//           value={priceRange[0]}
//           onChange={handelMinChange}
//         />

//         <input
//           type="range"
//           min="0"
//           max="999999"
//           step="100"
//           className="w-full"
//           value={priceRange[1]}
//           onChange={handelMaxChange}
//         />
//       </div>

//       {/* 🔄 Reset Button */}
//       <Button onClick={resetFilters} className="bg-pink-600 text-white mt-5 cursor-pointer w-full">
//         Reset Filters
//       </Button>
//     </div>
//   )
// }

// export default FilterSidebar





import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const FilterSidebar = ({
allProducts,
priceRange,
setPriceRange,
search,
setSearch,
category,
setCategory,
brand,
setBrand
}) => {

const Categories = [allProducts.map(p => p.category)]
const uniqueCategory = ['All', ...new Set(Categories.flat())]

const Brands = allProducts.map(p => p.brand)
const uniqueBrand = ['All', ...new Set(Brands)]

const handelCategoryCLick = (val) => {
setCategory(val)
}

const handelBrandClick = (e) => {
setBrand(e.target.value)
}

const handelMinChange = (e) => {
const value = Number(e.target.value)


if (value <= priceRange[1]) {
  setPriceRange([value, priceRange[1]])
}


}

const handelMaxChange = (e) => {
const value = Number(e.target.value)


if (value >= priceRange[0]) {
  setPriceRange([priceRange[0], value])
}


}

const resetFilters = () => {
setSearch('')
setCategory('All')
setBrand('All')
setPriceRange([0, 999999])
}

return ( <div className="bg-gray-100 mt-4 lg:mt-10 p-4 rounded-md h-max w-full lg:w-64">


  {/* Search */}
  <Input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"
  />

  {/* Category */}
  <h1 className="mt-5 font-semibold text-xl">
    Category
  </h1>

  <div className="flex flex-col gap-2 mt-3">

    {
      uniqueCategory.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
        >
          <input
            type="radio"
            name="category"
            checked={category === item}
            onChange={() => handelCategoryCLick(item)}
          />

          <Label>{item}</Label>
        </div>
      ))
    }

  </div>

  {/* Brand */}
  <h1 className="mt-5 font-semibold text-xl">
    Brand
  </h1>

  <select
    className="bg-white w-full p-2 border-gray-200 border-2 rounded-md"
    value={brand}
    onChange={handelBrandClick}
  >

    {
      uniqueBrand.map((item, index) => (
        <option
          key={index}
          value={item}
        >
          {item.toUpperCase()}
        </option>
      ))
    }

  </select>

  {/* Price Range */}
  <h1 className="mt-5 font-semibold text-xl mb-3">
    Price Range
  </h1>

  <div className="flex flex-col gap-2">

    <Label>
      Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
    </Label>

    <div className="flex flex-col sm:flex-row gap-2 items-center">

      <input
        type="number"
        min="0"
        max="5000"
        className="w-full sm:w-24 p-1 border border-gray-300 rounded"
        value={priceRange[0]}
        onChange={handelMinChange}
      />

      <span>-</span>

      <input
        type="number"
        min="0"
        max="999999"
        className="w-full sm:w-24 p-1 border border-gray-300 rounded"
        value={priceRange[1]}
        onChange={handelMaxChange}
      />

    </div>

    <input
      type="range"
      min="0"
      max="5000"
      step="100"
      className="w-full"
      value={priceRange[0]}
      onChange={handelMinChange}
    />

    <input
      type="range"
      min="0"
      max="999999"
      step="100"
      className="w-full"
      value={priceRange[1]}
      onChange={handelMaxChange}
    />

  </div>

  {/* Reset Button */}
  <Button
    onClick={resetFilters}
    className="bg-pink-600 hover:bg-pink-700 text-white mt-5 cursor-pointer w-full"
  >
    Reset Filters
  </Button>

</div>


)
}

export default FilterSidebar
