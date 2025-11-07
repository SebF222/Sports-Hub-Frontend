import { createContext, useContext, useState, useEffect } from "react";

//creating the auth context
const AuthContext = createContext();

// // creating a hook to consume context(give access to context variables)
export const useAuth = () => {
    const context = useContext(AuthContext)
    return context
};

const API_URL = 'http://127.0.0.1:5000'


// Create the context provider (wrapper that will get placed over my app)
export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [isLoading, setIsLoading] = useState(true)






    //login function 
    const login = async (email, password) =>{
        console.log(email, password)
        const response = await fetch(API_URL + '/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ 
                email: email,
                // username: username,
                password: password
            })
        })

        if(!response.ok){
            console.error('There was an issue logging in.')
        }

        const data = await response.json() // translating to js
        console.log(data)

        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)

    }

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


    // to make avalible thru out whole app
    const value = {
        token,
        user, 
        login,
        isLoading
   

    }

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
}

