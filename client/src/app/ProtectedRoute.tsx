import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useSelector((state: RootState) => state.auth);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!user) {
      return <div>You must be logged in to access this page.</div>;
    }
  
    return <>{children}</>;
  };
  
  export default ProtectedRoute;
  