import axiosInstance from "./axiosInstance";

const apiService = {
    getUserBio: async (userId) => {
        try {
            const response = await axiosInstance.get(`/users/profiles/${userId}/bio`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }, 
    getUserPic: async (userId) => {
        try {
            const response = await axiosInstance.get(`/users/profiles/${userId}/profile-pic`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }, 
    getUserLinks: async (userId) => {
        try {
            const response = await axiosInstance.get(`/users/profiles/${userId}/links`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }, 
    deleteUser: async (userId) => {
        try {
            const response = await axiosInstance.get(`/users/profiles/${userId}/delete/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    updateUserBio: async (userId, data) => {
        try {
            const response = await axiosInstance.post(`/users/profiles/${userId}/edit-bio`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateUserProfilePic: async (userId, data) => {
        try {
            const response = await axiosInstance.post(`/users/profiles/${userId}/edit-profile-pic`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addAccountLink: async (userId, data) => {
        try {
            const response = await axiosInstance.post(`/users/profiles/${userId}/add-link`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    removeAccountLink: async (userId, data) => {
        try {
            const response = await axiosInstance.post(`/users/get-token/`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    signIn: async (userId, data) => {
        try {
            // is the url supposed to be edit-bio?
            const response = await axiosInstance.post(`/users/profiles/${userId}/edit-bio`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFavorList: async () => {
        try {
            const response = await axiosInstance.get(`/favors/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getSpecFavor: async (favorId) => {
        try {
            const response = await axiosInstance.get(`/favors/${favorId}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createFavor: async (data) => {
        try {
            const response = await axiosInstance.post(`/favors/create/`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    editFavor: async (favorId, data) => {
        try {
            const response = await axiosInstance.post(`/favors/${favorId}/edit`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getTags: async () => {
        try {
            const response = await axiosInstance.get(`/favors/tags/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getSpecTag: async (tagId) => {
        try {
            const response = await axiosInstance.get(`/favors/tags/${tagId}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createTag: async (data) => {
        try {
            const response = await axiosInstance.post(`/favors/tags/create`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    editTag: async (tagId, data) => {
        try {
            const response = await axiosInstance.post(`/favors/tags/${tagId}/edit/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // takes user's filter, sort, and a search parameters 
    // filterParams and sortParams = {}, searchParam = " "
    viewBountyList: async (filterParams, sortParams, searchParam) => {
        try {
            const params = new URLSearchParams({...filterParams, ...sortParams, search: searchParam})     // combines all params into one object of URL query format
            const response = await axiosInstance.get(`/favors?${params}`)   // puts params into url
            return response.data
        } catch (error) {
            throw error;
        }
    },

    viewBounty: async (id) => {
        try {
            const response = await axiosInstance.get(`/favors/${id}`) 
            return response.data
        } catch (error) {
            throw error;
        }
    },

    // Once logged in, you don't need to pass in the id. This should send back data in the following format:
    // {"<id of the friend request>": {"from_user": username1, "to_user": username2}, ...}
    getFriendRequests: async () => {
        try {
            const response = await axiosInstance.get(`/users/get-friend-requests/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }, 

    //Same thing here,  dont need to pass id. Sorrya bout the formatting, the response needs to be a dict.
    //returns {"username1": "is friend :)", "username2": "is friend :)"} 
    getFriendsList: async () => {
        try {
            const response = await axiosInstance.get(`/users/get-friends-list/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }, 

    //username: the username of the friend to request.
    //returns {"success": True}
    sendFriendRequest: async (username) => {
        try {
            const response = await axiosInstance.get(`/users/send-friend-request/${username}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }, 

    //requestID: the integer id of the request (make sure to cast to string)
    //returns {"success": True}
    acceptFriendRequest: async (requestID) => {
        try {
            const response = await axiosInstance.get(`/users/accept-friend-request/${requestID}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }, 

    //requestID: the integer id of the request (make sure to cast to string)
    //returns {"success": True}
    rejectFriendRequest: async (requestID) => {
        try {
            const response = await axiosInstance.get(`/users/reject-friend-request/${requestID}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default apiService;

//     path('profiles/<slug:request_username>/', views.profile, name="profile"),
//     path('profiles/<slug:request_username>/delete/', views.delete_account, name="delete_account"),
//     path('profiles/<slug:request_username>/edit-bio', views.edit_bio, name="edit_bio"),
//     path('profiles/<slug:request_username>/edit-profile-pic', views.edit_profile_pic, name="edit_profile_pic"),
//     path('profiles/<slug:request_username>/add-link', views.add_link, name="add_link"),
//     path('profiles/<slug:request_username>/remove-link', views.remove_link, name="remove_link"),
//     path('get-token/', rest_framework.authtoken.views.obtain_auth_token)

//     path("", views.favor_list, name="favor_list"), 
//     path("<int:favor_id>/", views.favor_detail, name="favor_detail"),
//     path("create/", views.create_favor, name="create_favor"),
//     path("<int:favor_id>/edit", views.edit_favor, name="edit_favor"),
//     path("tags/", views.tag_list, name="tag_list"),
//     path("tags/<int:tag_id>/", views.tag_detail, name="tag_detail"),
//     path("tags/create", views.create_tag, name="create_tag"),
//     path("tags/<int:tag_id>/edit/", views.edit_tag, name="edit_tag")