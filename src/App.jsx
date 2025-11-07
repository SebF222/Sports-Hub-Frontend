import { BrowserRouter, Routes, Route} from "react-router-dom"
import HomeView from "./views/HomeView"
import LoginView from "./views/LoginView"
import SignupView from "./views/SignupView"
import TeamDetailsView from "./views/TeamDetailsView"
import ProfileView from "./views/ProfileView"
import ManageFavoritesView from "./views/ManageFavoritesView"
import SetupView from "./views/SetupView"
import Navbar from "./components/Navbar/Navbar"


function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<HomeView />} />
          <Route path='/login' element={<LoginView />} />
          <Route path= '/signup' element={<SignupView />} />
          <Route path= '/setup' element={<SetupView />} />
          <Route path= '/profile' element={<ProfileView />} />
          <Route path= '/favorites/manage' element={<ManageFavoritesView />} /> 
          <Route path= '/team/:sport/:teamId' element={<TeamDetailsView />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
