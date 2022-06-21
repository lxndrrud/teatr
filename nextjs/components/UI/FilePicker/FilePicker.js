import React, { useState } from 'react'
import { Button } from "react-bootstrap"

const FilePicker = ({id}) => {
    let [isError, setIsError] = useState(false)
    let [error, setError] = useState()
    let [selectedFile, setSelectedFile] = useState()
    onFileChange = event => {
        // Update the state
        setSelectedFile(event.target.files[0])
      
    };
    // On file upload (click the upload button)
    onFileUpload = () => {
    
        // Create an object of formData
        const formData = new FormData();
      
        // Update the formData object
        formData.append(
          id,
          selectedFile,
          selectedFile.name
        );
      
        // Details of the uploaded file
        console.log(this.state.selectedFile);
      
        // Request made to the backend api
        // Send formData object
        
        //axios.post("api/uploadfile", formData);

        // TODO Сделать тут action для загрузки файла на сервер
      };
      
    return (
        <div>
            <span>Выберите файл</span>
            {
                isError 
                ?
                <span style={{ color: "red" }}>
                    {error}
                </span>
                : null
            }
            <input id={id} type="file" onChange={onFileChange} />
            <Button />
        </div>
    )
}

export default FilePicker