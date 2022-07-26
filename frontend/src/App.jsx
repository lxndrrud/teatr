import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AdminRoute, LoginRoute } from "./middlewares/auth"
import "./styles/globals.css"

import Home from "./pages/index"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import PersonalAreaPage from "./pages/user/personalArea"
import AdminLoginPage from "./pages/reservation-admin/login"
import AdminIndex from "./pages/reservation-admin"
import PlayCSVUploadingPage from "./pages/reservation-admin/csv/play"
import SessionCSVUploadingPage from "./pages/reservation-admin/csv/session"
import SchedulePage from "./pages/schedule"
import RepertoirePage from "./pages/repertoire"
import PlayPage from "./pages/repertoire/[playid]"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/repertoire">
            <Route path="" element={<RepertoirePage />} />
            <Route path=":idPlay" element={<PlayPage />} />
          </Route>
          <Route path='/user' >
            <Route path="personalArea" element={
              <LoginRoute>
                <PersonalAreaPage />
              </LoginRoute>
            } />
          </Route>
          <Route path="/reservation-admin" >
            <Route path="" element={
                <AdminRoute>
                  <AdminIndex />
                </AdminRoute>
              } 
            />
            
            <Route path="login" element={<AdminLoginPage />} />
            <Route path="csv">
              
              <Route path="play" element={
                  <AdminRoute>
                    <PlayCSVUploadingPage />
                  </AdminRoute>
                } 
              />
             
              
              <Route path="session" element={
                  <AdminRoute>
                    <SessionCSVUploadingPage />
                  </AdminRoute>
                } 
              />
              
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
