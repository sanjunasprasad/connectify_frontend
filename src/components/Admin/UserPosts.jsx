import React, { useEffect, useState } from 'react'
import { axiosAdminInstance } from "../../services/axios/axios";
import Swal from "sweetalert2"
import altusericon from "../../Icons/user.png"
import 'sweetalert2/dist/sweetalert2.min.css'
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function UserPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosAdminInstance.get('/admin/getPosts');
        console.log("POST RESPONSE", response.data)
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleShowPost = async (postId, postImage, caption) => {
    if (isImageUrl(postImage)) {
      Swal.fire({
        text: caption,
        imageUrl: postImage,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image"
      });
    } else {
      Swal.fire({
        text: caption,
        html: `<video width="400" height="200" controls><source src="${postImage}" type="video/mp4"></video>`
      });
    }
  };
  function isImageUrl(url) {
    return /\.(gif|jpg|jpeg|tiff|png|avif)$/i.test(url);
  }
  

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />

        <section className="mx-auto w-full max-w-7xl px-4 py-4">
          <div className="flex flex-col space-y-4  md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-lg font-semibold">All Posts</h2>
              <p className="mt-1 text-sm text-gray-700">
                This is a list of all Posts.
              </p>
            </div>
            <div>
            </div>
          </div>
          <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          No.
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span>User Name</span>
                        </th>
                        <th
                          scope="col"
                          className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          PostId
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Upload Date
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Total Comments
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span>Total likes</span>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                      {posts.map((post, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap text-sm px-4 py-4">
                            {index + 1}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={ post?.postedUserImage || altusericon}

                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {post?.postedUser}
                                </div>
                                <div className="text-sm text-gray-700">

                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-12 py-4">
                            <div 
                            onClick={() => handleShowPost(post._id , post.file,post.caption)} 
                            className="text-sm text-gray-900 ">
                              {post?._id}
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4">

                            {post?.postedDate && new Date(post.postedDate).toLocaleDateString('en-GB')}
                          </td>

                          <td className="whitespace-nowrap px-12 py-4">
                            <div className="text-sm text-gray-900 ">
                              {post?.totalComments}
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-12 py-4">
                            <div className="text-sm text-gray-900 ">
                              {post?.totalLikes}
                            </div>
                          </td>


                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default UserPosts
