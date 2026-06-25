import { createBrowserRouter } from "react-router-dom";
import MainLayOut from "../LayOut/MainLayOut.jsx";
import Home from "../Pages/HomePage/Home.jsx";
import Login from "../Authentication/AuthenticationPages/Login.jsx";
import Registration from "../Authentication/AuthenticationPages/Registration.jsx";
import About from "../Pages/About/about.jsx";
import NGOLayout from "../LayOut/NGOLayout/NGOLayout.jsx";
import NgoAdminDashboard from "../Pages/NGO/NGOAdminDashboard.jsx/NgoAdminDashboard.jsx";
import LaunchProject from "../Pages/NGO/LaunchProject/LaunchProject.jsx";
import NGOProjects from "../Pages/NGO/NGOProject/NGOProjects.jsx";
import AllProjects from "../Pages/Project/Allprojects/AllProjects.jsx";
import UpdateProjects from "../Pages/Project/UpdateProjects/UpdateProjects.jsx";
import ProjectDetails from "../Pages/Project/ProjectDetailPage/ProjectDetails.jsx";
import VolunteerDonorLayOut from "../LayOut/Volunteer&DonorLayOut/VolunteerDonorLayOut.jsx";
import VolunteerDashboard from "../Pages/Volunteer/VolunteerDashboard/VolunteerDonorDashboard.jsx";
import DonorLayout from "../LayOut/DonorLayOut/DonorLayout.jsx";
import DonorDashboard from "../Pages/Donor/DonorDashboard/DonorDashboard.jsx";
import MyProjectList from "../Pages/Volunteer/MyProjectList/MyProjectList.jsx";
import VarifyUser from "../Pages/Admin/VarifyUser/VarifyUser.jsx";
import VarifyProject from "../Pages/Admin/VarifyProject/VarifyProject.jsx";
import AllProjectList from "../Pages/Admin/AllProjectList/AllProjectList.jsx";
import VolunteerHub from "../Pages/NGO/CollaborationDiscoveryBoard/VolunteerHub/VolunteerHub.jsx";
import VolunteerdonorList from "../Pages/Admin/Volunteerlist/Volunteer&donorList.jsx";
import Sattings from "../components/Sattings/Sattings.jsx";
import EditProfile from "../components/Sattings/EditProfile.jsx";
import VolunteerDonorDashboard from "../Pages/Volunteer/VolunteerDashboard/VolunteerDonorDashboard.jsx";
import AdminDashboard from "../Pages/Admin/AminDashboard/AdminDashBoard.jsx";
import Contact from "../Pages/Contact/Contact.jsx";
import NotFound from "../Pages/NotFound/NotFound.jsx";
import DonorRelation from "../Pages/NGO/DonorRelation/DonorRelation.jsx";
import AgentRoute from "./AgentRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import MyDonation from "../Pages/Volunteer/MyDonation/MyDonation.jsx";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayOut />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/projects",
                element:<AllProjects></AllProjects>
            },
            {
                path: "/projects/:id",
                element: <ProjectDetails />
            },
            {
                path: "/ngo",
                element:<NGOLayout></NGOLayout>,
                children:[
                    {
                        path:'/ngo',
                        element:<AgentRoute><NgoAdminDashboard></NgoAdminDashboard></AgentRoute>
                    },
                    {
                        path:'/ngo/launchproject',
                        element:<AgentRoute><LaunchProject></LaunchProject></AgentRoute>
                    },{
                        path:'/ngo/projects',
                        element:<AgentRoute><NGOProjects></NGOProjects></AgentRoute>
                    },
                    {
                        path:'/ngo/editproject/:id',
                        element:<AgentRoute><UpdateProjects></UpdateProjects></AgentRoute>
                    },
                    {
                        path:"/ngo/volunteer",
                        element:<AgentRoute><VolunteerHub></VolunteerHub></AgentRoute>

                    },
                    {
                        path:"/ngo/settings",
                        element:<Sattings></Sattings>
                    },{
                        path:"/ngo/settings/edit",
                        element:<EditProfile></EditProfile>
                    },{
                        path:"/ngo/donor-relation",
                        element:<AgentRoute><DonorRelation></DonorRelation></AgentRoute>
                    }
                    
                ]
            },
            {
                path: "/volunteer&donor",
                element:<NGOLayout></NGOLayout>,
                children:[
                    {
                        path:'/volunteer&donor',
                        element:<VolunteerDonorDashboard></VolunteerDonorDashboard>
                    },
                    {
                        path:"/volunteer&donor/myprojectlist",
                        element:<MyProjectList></MyProjectList>
                    },{
                        path:'/volunteer&donor/mydonotion',
                        element:<MyDonation></MyDonation>
                    }
                    
                ]
            },
            {
                path: "/donor",
                element:<NGOLayout></NGOLayout>,
                children:[
                    {
                        path:'/donor',
                        element:<DonorDashboard></DonorDashboard>
                    },
                    {
                        path:'/donor/mydonation',
                        element:<MyDonation></MyDonation>
                    },
                    
                ]
            },
            {
                path: "/admin",
                element:<NGOLayout></NGOLayout>,
                children:[
                    {
                        path:'/admin',
                        element:<AdminRoute><AdminDashboard></AdminDashboard></AdminRoute>
                    },{
                        path:'/admin/varifyUser',
                        element:<AdminRoute><VarifyUser></VarifyUser></AdminRoute>

                    },
                    {
                        path:"/admin/varifyProject",
                        element:<AdminRoute><VarifyProject></VarifyProject></AdminRoute>
                    },
                    {
                        path:"/admin/projectlist",
                        element:<AdminRoute><AllProjectList></AllProjectList></AdminRoute>
                    },{
                        path:"/admin/volunteerlist",
                        element:<AdminRoute><VolunteerdonorList></VolunteerdonorList></AdminRoute>
                    },
                ]
            }
        ]
    }
    , {
        path: "/register",
        element: <Registration></Registration>
    }
    ,
    {
        path: "/login",
        element: <Login></Login>
    },
    {
        path: "/about",
        element: <About></About>
    },
    {
        path:'/contact',
        element:<Contact></Contact>
    },{
        path:"*",
        element:<NotFound></NotFound>
    }


]);