import React from 'react'
import styles from "./PersonalArea.module.css"

function PersonalArea({ user }) {
  return (
    <div className={styles.container} >
      {
        !user
        ? 
          <h3>Ой...</h3> 
        : 
          <table>
            <tbody>
              <tr>
                <td>Имя: </td> <td>{user.firstname}</td>
              </tr>
              <tr>
                <td>Отчество: </td> <td>{user.middlename}</td>
              </tr>
              <tr>
                <td>Фамилия: </td> <td>{user.lastname}</td>
              </tr>
              <tr>
                <td>Почта: </td> <td>{user.email}</td>
              </tr>
            </tbody>
          </table>
      }
    </div>
  )
}

export default PersonalArea