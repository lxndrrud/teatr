import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AdminRoute, LoginRoute } from "./middlewares/auth"
import "./styles/globals.css"
import 'typeface-montserrat'

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
import ConfirmationPage from "./pages/confirm/[reservationid]"
import SessionReservationPage from "./pages/reserve/[sessionid]"
import ControlIndexPage from "./pages/control"
import ReservationDetailPage from "./pages/control/[reservationid]"
import DeleteReservationPage from "./pages/control/delete/[reservationid]"
import PaymentReservationPage from "./pages/control/payment/[reservationid]"
import EditUserInfoPage from "./pages/user/editPersonalInfo"
import EditUserPasswordPage from "./pages/user/editPassword"
import RestorePasswordPage from "./pages/user/restore/restorePassword"
import UserCSVUploadingPage from "./pages/reservation-admin/csv/user"

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
          <Route path="/control">
            <Route path="" element={
              <LoginRoute>
                <ControlIndexPage />
              </LoginRoute>
            } />
            <Route path=":idReservation" element={
              <LoginRoute>
                <ReservationDetailPage />
              </LoginRoute>
            } />
            <Route path="delete" >
              <Route path=":idReservation" element={
                <LoginRoute>
                  <DeleteReservationPage />
                </LoginRoute>
              } />
            </Route>  
            <Route path="payment" >
              <Route path=":idReservation" element={
                <LoginRoute>
                  <PaymentReservationPage />
                </LoginRoute>
              } />
            </Route>
          </Route>
          <Route path="/confirm">
            <Route path=":idReservation" element={
              <LoginRoute>
                <ConfirmationPage />
              </LoginRoute>
            } />
          </Route>
          <Route path="/reserve">
            <Route path=":idSession" element={
              <LoginRoute>
                <SessionReservationPage />
              </LoginRoute>
            } />
          </Route>
          <Route path='/user' >
            <Route path="personalArea" element={
              <LoginRoute>
                <PersonalAreaPage />
              </LoginRoute>
            } />
            <Route path="edit">
              <Route path="personal" element={
                <LoginRoute>
                  <EditUserInfoPage />
                </LoginRoute>
              } />
              <Route path="password" element={
                <LoginRoute>
                  <EditUserPasswordPage />
                </LoginRoute>
              }/>
            </Route> 
            <Route path="restore">
              <Route path="password" element={<RestorePasswordPage />} />
            </Route>
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

              <Route path='user/create' element={
                  <AdminRoute>
                    <UserCSVUploadingPage />
                  </AdminRoute>
              } />
              
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
