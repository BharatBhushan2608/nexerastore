// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import axios from 'axios'
// import { Edit, Eye, Search } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import UserLogo from "../../assets/userlogo.jpg"
// import { useNavigate } from 'react-router-dom'

// const AdminUsers = () => {

//   const [users, setUsers] = useState([])
//   const [searchTerm ,setSearchTerm ] = useState("")
//   const navigate = useNavigate();

//   const getAllUsers = async () => {
//     const accessToken = localStorage.getItem("accessToken")

//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_URL}/api/v1/user/all-user`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       )

//       if (res.data.success) {
//         setUsers(res.data.users)
//       }

//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const filteredUsers = users.filter(user=>
//     `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   useEffect(() => {
//     getAllUsers()
//   }, [])

//   console.log(users)

//   return (
//     <div className="pl-87.5 py-20 pr-20 mx-auto px-4">

//       <h1 className="font-bold text-2xl">User Management</h1>
//       <p>View and manage registered users</p>

//       {/* Search */}
//       <div className="flex relative w-75 mt-6">
//         <Search className="absolute left-2 top-1 text-gray-600 w-5" />

//         <Input
//           value={searchTerm}
//           onChange = {(e)=>setSearchTerm(e.target.value)}
//           className="pl-10"
//           placeholder="Search Users..."
//         />
//       </div>

//       {/* Users Grid */}
//       <div className="grid grid-cols-3 gap-7 mt-7">

//         {
//           filteredUsers.map((user, index) => {
//             return (
//               <div
//                 key={index}
//                 className="bg-pink-100 p-5 rounded-lg"
//               >

//                 <div className="flex items-center gap-2">

//                   <img
//                     src={user?.profilePic || UserLogo}
//                     alt=""
//                     className="rounded-full w-16 aspect-square object-cover border border-pink-600"
//                   />

//                   <div>
//                     <h1 className="font-semibold">
//                       {user?.firstName} {user?.lastName}
//                     </h1>

//                     <h3>{user?.email}</h3>
//                   </div>

//                 </div>

//                 <div className="flex gap-3 mt-3">

//                   <Button onClick={()=>navigate(`/dashboard/users/${user._id}`)} variant='outline'><Edit/>Edit</Button>

//                   <Button onClick={()=>navigate(`/dashboard/users/orders/${user._id}`)}><Eye/>Show Order</Button>

//                 </div>
//               </div>
//             )
//           })
//         }
//       </div>
//     </div>
//   )
// }

// export default AdminUsers





import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Edit, Eye, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import UserLogo from "../../assets/userlogo.jpg"
import { useNavigate } from 'react-router-dom'

const AdminUsers = () => {

  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate();

  const getAllUsers = async () => {

    const accessToken = localStorage.getItem("accessToken")

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/all-user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        setUsers(res.data.users)
      }

    } catch (error) {
      console.log(error)
    }

  }

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    getAllUsers()
  }, [])

  return (

    <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* Heading */}

      <div className="mb-6">

        <h1 className="text-2xl sm:text-3xl font-bold">
          User Management
        </h1>

        <p className="text-gray-600">
          View and manage registered users
        </p>

      </div>

      {/* Search */}

      <div className="relative w-full sm:max-w-md mb-8">

        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />

        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Users..."
          className="pl-10 bg-white"
        />

      </div>

      {/* Users */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {
          filteredUsers.map((user, index) => {

            return (

              <div
                key={index}
                className="bg-pink-100 rounded-xl shadow-sm hover:shadow-md transition p-5 h-full flex flex-col"
              >

                {/* User */}

                <div className="flex flex-col sm:flex-row items-center gap-4">

                  <img
                    src={user?.profilePic || UserLogo}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover border-2 border-pink-600"
                  />

                  <div className="text-center sm:text-left">

                    <h2 className="font-bold text-lg break-words">
                      {user?.firstName} {user?.lastName}
                    </h2>

                    <p className="text-sm text-gray-600 break-all">
                      {user?.email}
                    </p>

                  </div>

                </div>

                {/* Buttons */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/dashboard/users/${user._id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    className="w-full"
                    onClick={() => navigate(`/dashboard/users/orders/${user._id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Show Order
                  </Button>

                </div>

              </div>

            )

          })
        }

      </div>

    </div>

  )
}

export default AdminUsers