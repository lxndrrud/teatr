import React, {useState} from 'react'
import CustomButton from '../CustomButton/CustomButton'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { useSelector } from "react-redux"
import styles from "./FilePicker.module.css"
import SuccessMessage from '../SuccessMessage/SuccessMessage'
import IconSVG from '../IconSVG/IconSVG'

const FilePicker = ({ onClickHook, onChangeHook }) => {
    let error = useSelector(state => state.session.error)
    let success = useSelector(state => state.session.success)
    let [filename, setFilename] = useState(null)
    
    const onFileChange = event => {
        // Update the state
        onChangeHook(event.target.files[0])
        setFilename(event.target.files[0].name)
    };
    return (
        <div>
            {
                filename !== null
                ? <span>{filename}</span>
                : null
            }
            <input id="upload" type="file" onChange={onFileChange} style={{ display: "none"}} />
            <label for="upload" className={styles.uploadButtonLabel} >
                <IconSVG data={"M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"}
                    color="#fff" />
                <span>Загрузить</span>
            </label>
            <CustomButton type="submit" 
                onClickHook={onClickHook} 
                value="Отправить файл" 
                buttonType={'green'}/>
            {
                success
                ?
                <SuccessMessage text={success} />
                : (error
                    ?
                    <ErrorMessage text={error} />
                    : null)
            }
            
        </div>
    )
}

export default FilePicker