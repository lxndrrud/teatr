import React from 'react'
import { useSelector } from 'react-redux'

function PersonalArea() {
  let user = useSelector(state => state.user.user)

  return (
    <div className="w-[100%] sm:w-[600px] bg-[#eeeeee] p-2 border-2 border-solid
      flex flex-col justify-center sm:justify-end rounded-lg w" >
      {
        !user
        ? 
          <h3>Ой...</h3> 
        : 
          <table>
            <tbody>
              <tr>
                <td>Фамилия: </td>
                <td>{user.lastname}</td>
              </tr>
              <tr>
                <td>Имя: </td>
                <td>{user.firstname}</td>
              </tr>
              <tr>
                <td>Отчество: </td>
                <td>{user.middlename}</td>
              </tr>
              <tr>
                <td>Почта: </td>
                <td>{user.email}</td>
              </tr>
            </tbody>
          </table>
      }
    </div>
  )
}

export default PersonalArea