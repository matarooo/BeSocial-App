import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import AuthProtected from "../components/AuthProtected/AuthProtected";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Posts from "../pages/Feed/Posts";
import Profile from "../pages/Profile/Profile";
import ProfileLayout from "../pages/Profile/ProfileLayout";
import UserProfile from "../pages/Profile/UserProfile/UserProfile";
import SuggestionLayout from "../pages/Suggestions/SuggestionLayout";
import Suggestions from "../pages/Suggestions/Suggestions";
import Settings from "../pages/Settings/Settings";
import Notifications from "../pages/Notifications/Notifications";
import NotificationsLayout from "../pages/Notifications/NotificationsLayout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <ProtectedRoute><Posts /></ProtectedRoute> },
            { path: "myPosts", element: <ProtectedRoute><Posts feedType="myPosts" /></ProtectedRoute> },
            { path: "community", element: <ProtectedRoute><Posts feedType="community" /></ProtectedRoute> },
            { path: "bookmarked", element: <ProtectedRoute><Posts feedType="saved" /></ProtectedRoute> },
            { path: "settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
            { path: "login", element: <AuthProtected><Login /></AuthProtected> },
            { path: "register", element: <AuthProtected><Register /></AuthProtected> },
        ]
    },
    { path:'/profile', element: <ProtectedRoute><ProfileLayout /></ProtectedRoute> , 
        children:[
                { index: true, element: <Profile/> },
                {path:':id' , element:<UserProfile />}
            ] },
    {path:'/suggestions', element:<ProtectedRoute><SuggestionLayout /></ProtectedRoute> , 
        children: [
            {index:true, element: <Suggestions/>}
        ]
    },
    {path:'/notifications', element:<ProtectedRoute><NotificationsLayout /></ProtectedRoute> , 
        children: [
            {index:true, element: <Notifications/>}
        ]
    }
])