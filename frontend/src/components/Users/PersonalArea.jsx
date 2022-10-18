import React from 'react'
import { useSelector } from 'react-redux'

function PersonalArea() {
  let user = useSelector(state => state.user.user)

  return (
    <div className="p-2 sm:p-4 w-[max-content] sm:w-[800px] 
                    bg-[#f1e1f5] shadow-xl
                    flex flex-col whitespace-nowrap justify-center rounded-lg" >
      {
        !user
        ? 
          <h3>Ой...</h3> 
        : 
          <table>
            <tbody>
              <tr>
                <td>Фамилия: </td>
                <td className='text-'>{user.lastname}</td>
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