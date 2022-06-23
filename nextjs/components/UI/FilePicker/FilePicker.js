import React from 'react'
import CustomButton from '../CustomButton/CustomButton'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { useSelector } from "react-redux"
import styles from "./FilePicker.module.css"

const FilePicker = ({ onClickHook, onChangeHook }) => {
    let error = useSelector(state => state.session.error)
    let success = useSelector(state => state.session.success)
    
    const onFileChange = event => {
        // Update the state
        onChangeHook(event.target.files[0])
    };
    return (
        <div>
            <span>Выберите файл</span>
            <input id="upload" type="file" onChange={onFileChange} style={{ display: "none"}} />
            <label for="upload" class="button" 
                style={{border: "1px solid #ae2876", color: "#F1FAEE", backgroundColor: "#ae2876" ,
                borderRadius: "10px", padding: "10px", display: "flex"}}>
                Загрузить
            </label>
            <CustomButton type="submit" 
                onClickHook={onClickHook} 
                value="Загрузить файл" 
                buttonType={'green'}/>
            {
                success
                ?
                <span>
                    {success}
                </span>
                : (error
                    ?
                    <ErrorMessage text={error} />
                    : null)
            }
            
        </div>
    )
}

export default FilePicker