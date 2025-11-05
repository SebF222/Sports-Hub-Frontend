import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//creating the auth context
const AuthContext = createContext();

// // creating a hook to consume context(give access to context variables)
export const useAuth = () => {
    const context = useContext(AuthContext)
    return context
}


// Create the context provider (wrapper that will get placed over my app)
export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()


    // check if user is already logged in when app loads instead of constanly having to log back in 
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser){
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])


    const value = {

    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

