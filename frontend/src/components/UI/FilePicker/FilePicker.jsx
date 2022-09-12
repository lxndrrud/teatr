import React, {useState} from 'react'
import CustomButton from '../CustomButton/CustomButton'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import ErrorMessageBlock from '../ErrorMessageBlock/ErrorMessageBlock'
import { useSelector } from "react-redux"
import styles from "./FilePicker.module.css"
import SuccessMessage from '../SuccessMessage/SuccessMessage'
import IconSVG from '../IconSVG/IconSVG'

function FilePicker({ onClickHook, onChangeHook, error, success, isMultiple=false }) {
    let [filename, setFilename] = useState(null)

    const onFileChange = event => {
        // Update the state
        onChangeHook(event.target.files[0])
        if (!isMultiple) { 
            setFilename(event.target.files[0].name)
            return
        }
        if (!filename) setFilename("")
        let filenames = filename ? filename : ''
        for (let file of event.target.files) {
            filenames += `${file.name}, `
        }
        filenames.slice(0, -2)
        setFilename(filenames)
    };
    return (
        <div>
            {
                filename !== null
                ? <span>{filename}</span>
                : null
            }
            <input 
                id="upload" 
                type="file" 
                onChange={onFileChange} 
                style={{ display: "none"}} 
                multiple={ isMultiple }
            />
            <label htmlFor="upload" className={styles.uploadButtonLabel} >
                <IconSVG data={"M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"}
                    color="#fff" />
                <span>Загрузить</span>
            </label>
            <CustomButton type="submit" 
                onClickHook={onClickHook} 
                value="Отправить файл" 
                buttonType={'green'}/>
            {
                !error || error.length === 0
                    ?
                        success
                            &&
                        <SuccessMessage text={success} />
                    : 
                        typeof error === 'string' 
                        ?
                            <ErrorMessage text={error} />
                        :  
                            <ErrorMessageBlock textArray={error} />
            }
            
        </div>
    )
}

export default FilePicker