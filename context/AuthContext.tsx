import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosClient from "@/lib/axios";

interface User {
  id: number;
  name: string;
  role_id: number;
  percentage: number;
  image: string;
  branch_id: number;
  branch_name: string;
  login_at: number;
  trainer_type: string;
}

interface AuthContextType {
  user: User | null;
  userPermissions: string[];
  fetchUserData: () => void;
  updateUserData: () => void;
  token: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const getTokenFromLocalStorage = () => {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem("ACCESS_TOKEN")
    : null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(getTokenFromLocalStorage());

  const fetchUserData = async () => {
    try {
      const userResponse = await axiosClient.get("/auth/user");
      const userId = userResponse.data.id;
      setUser(userResponse.data);

      const permissionsResponse = await axiosClient.get(
        `/users/${userId}/permissions`,
      );
      const permissionNames = permissionsResponse.data.map(
        (perm: { name: string }) => perm.name,
      );
      setUserPermissions(permissionNames);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateUserData = useCallback(async () => {
    await fetchUserData();
  }, []);

  const memoizedSetToken = useCallback((newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("ACCESS_TOKEN", newToken);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  }, []);

  const memoizedSetUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosClient.post("/logout");
      setUser(null);
      localStorage.removeItem("USER");
      localStorage.removeItem("ACCESS_TOKEN");
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
    };
    fetchData().catch((error) => console.error("Error in fetchData:", error));
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      userPermissions,
      fetchUserData,
      updateUserData,
      token,
      setToken: memoizedSetToken,
      setUser: memoizedSetUser,
      logout,
    }),
    [
      user,
      userPermissions,
      updateUserData,
      token,
      memoizedSetToken,
      memoizedSetUser,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
