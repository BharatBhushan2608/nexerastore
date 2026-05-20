import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import userlogo from '../assets/userlogo.jpg'


import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlice'
import MyOrder from './MyOrder'
 

const Profile = () => {
    const { user } = useSelector((store) => store.user);
    const params = useParams()
    const userid = params.userId
    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNo: user?.phoneNo,
        address: user?.address,
        city: user?.city,
        zipCode: user?.zipCode,
        profilePic: user?.profilePic,
        role: user?.role,

    })

    const [file, setFile] = useState(null);

    const dispatch = useDispatch() ;

    const handelChange = async (e) => {
        setUpdateUser({...updateUser, [e.target.name]: e.target.value })
    }

    const handelFileChange = async (e) => {
         const selectedFile = e.target.files[0];
         setFile(selectedFile);
         setUpdateUser({...updateUser, profilePic:URL.createObjectURL(selectedFile)})
    }

    const handelSubmit = async (e) => {
        e.preventDefault() ; 
        const accessToken = localStorage.getItem("accessToken") ;

        try {
          // use fromdatafor text and file both
          const formData = new FormData() ;
          formData.append("firstName", updateUser.firstName) ;
          formData.append("lastName", updateUser.lastName) ;
          formData.append("email", updateUser.email) ;
          formData.append("phoneNo", updateUser.phoneNo) ;
          formData.append("address", updateUser.address) ;
          formData.append("city", updateUser.city) ;
          formData.append("zipCode", updateUser.zipCode) ;
          formData.append("role", updateUser.role) ;
          if(file){
            formData.append("file", file) ; //image file for backend multer 
          }
          const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/user/update/${userid}`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
          });

          if(res.data.success){
            toast.success(res.data.message);
            dispatch(setUser(res.data.user));
          }

        } catch (error) {
          console.log(error);
          toast.error("Failed to update profile. Please try again.") ;
        }
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        
        {/* Tabs Header */}
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile">
          <div>
            <div className="flex flex-col justify-center items-center bg-gray-100">
              
              <h1 className="font-bold mb-7 text-2xl text-gray-800">
                Update Profile
              </h1>

              <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">

                {/* Profile Image */}
                <div className="flex  flex-col items-center">
                  <img
                    src={updateUser?.profilePic || userlogo }
                    alt="profile"
                    className="w-40 h-30 rounded-full object-cover border-4 border-pink-800"
                  />

                  <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 h-10 w-20 ">
                    Change Profile
                    <input type="file" accept="image/*" className="hidden" 
                    onChange={handelFileChange}
                    />
                  </Label>
                </div>

                {/* Profile Form */}
                <form onSubmit={handelSubmit} className="space-y-4 shadow-lg p-5 rounded-lg bg-white w-full">
                  
                  <div className="grid grid-cols-2 gap-4">
                    
                    <div>
                      <Label>First Name</Label>
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={updateUser.firstName}
                        onChange={handelChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>

                    <div>
                      <Label>Last Name</Label>
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={updateUser.lastName}
                        onChange={handelChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>

                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="example@email.com"
                      disabled
                      value={updateUser.email}
                        onChange={handelChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      type="text"
                      name="phoneNo"
                      placeholder="Enter your Contact No"
                      value={updateUser.phoneNo}
                        onChange={handelChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <Label>Address</Label>
                    <Input
                      type="text"
                      name="address"
                      placeholder="Enter your Address"
                      value={updateUser.address}
                        onChange={handelChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label>City</Label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Enter your City"
                      value={updateUser.city}
                        onChange={handelChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <Label>Zip Code</Label>
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="Enter your ZipCode"
                      value={updateUser.zipCode}
                        onChange={handelChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  </div>

                  

                  <Button
                    type="submit"
                    className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg"
                  >
                    Update Profile
                  </Button>

                </form>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ORDERS TAB */}
        <TabsContent value="orders">
           <MyOrder/>
        </TabsContent>

      </Tabs>
    </div>
    )
}

export default Profile