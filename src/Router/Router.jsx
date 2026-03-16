import { createBrowserRouter } from "react-router-dom";
import MainLayOut from "../LayOut/MainLayOut.jsx";
import Home from "../Pages/HomePage/Home.jsx";
import Login from "../Authentication/AuthenticationPages/Login.jsx";
import Registration from "../Authentication/AuthenticationPages/Registration.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayOut />,
        children: [
            {
                path: "/",
                element: <Home />
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
    }


]);