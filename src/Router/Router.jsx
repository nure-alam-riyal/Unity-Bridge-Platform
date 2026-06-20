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
                        element:<NgoAdminDashboard></NgoAdminDashboard>
                    },
                    {
                        path:'/ngo/launchproject',
                        element:<LaunchProject></LaunchProject>
                    },{
                        path:'/ngo/projects',
                        element:<NGOProjects></NGOProjects>
                    },
                    {
                        path:'/ngo/editproject/:id',
                        element:<UpdateProjects></UpdateProjects>
                    },
                    {
                        path:"/ngo/volunteer",
                        element:<VolunteerHub></VolunteerHub>

                    },
                    {
                        path:"/ngo/settings",
                        element:<Sattings></Sattings>
                    },{
                        path:"/ngo/settings/edit",
                        element:<EditProfile></EditProfile>
                    }
                    
                ]
            },
            {
                path: "/volunteer",
                element:<NGOLayout></NGOLayout>,
                children:[
                    {
                        path:'/volunteer',
                        element:<VolunteerDonorDashboard></VolunteerDonorDashboard>
                    },
                    {
                        path:"/volunteer/myprojectlist",
                        element:<MyProjectList></MyProjectList>
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
                    
                ]
            },
            {
                path: "/admin",
                element:<NGOLayout></NGOLayout>,
                children:[
                    {
                        path:'/admin',
                        element:<AdminDashboard></AdminDashboard>
                    },{
                        path:'/admin/varifyUser',
                        element:<VarifyUser></VarifyUser>

                    },
                    {
                        path:"/admin/varifyProject",
                        element:<VarifyProject></VarifyProject>
                    },
                    {
                        path:"/admin/projectlist",
                        element:<AllProjectList></AllProjectList>
                    },{
                        path:"/admin/volunteerlist",
                        element:<VolunteerdonorList></VolunteerdonorList>
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
    }


]);