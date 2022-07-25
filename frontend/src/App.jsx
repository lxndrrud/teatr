import { BrowserRouter, Route, Routes } from "react-router-dom"
import { LoginRoute } from "./middlewares/auth"
import Home from "./pages/index"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import PersonalAreaPage from "./pages/user/personalArea"
import "./styles/globals.css"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/user' >
            <Route path="personalArea" element={
              <LoginRoute>
                <PersonalAreaPage />
              </LoginRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
