import { type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../store/index";

interface ProtectedRouteProps{
    children: ReactNode;
}
export const ProtectedRoute = ({children}: ProtectedRouteProps)=>{
    const {token} = useSelector((state:RootState)=>state.auth);
    if (!token){
        return <Navigate to="/login" replace />
    }
    return <>{children}</>
}