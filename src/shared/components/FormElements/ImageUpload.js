import React ,{useRef, useState, useEffect} from 'react'
import Button from './Button'
import './ImageUpload.css'

const ImageUpload = props => {
    const [file,setFile]= useState()
    const [previewUrl, setPreviewUrl]= useState()
    const [isValid, setIsValid]= useState(false)

    useEffect(()=> {
        if (!file) {
           return 
        }
       const fileReader = new FileReader()
       fileReader.onload=()=>{
           setPreviewUrl(fileReader.result)
       }
       fileReader.readAsDataURL(file)
    },[file])

    const filePickerRef = useRef()

    const pickedHandler = event =>{
        let pickedFile
        let fileIsValid= isValid
        if(event.target.files && event.target.files.length === 1){
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            setIsValid(true)
            fileIsValid = true
        }else{
            setIsValid(false)
            fileIsValid = false
        }
        props.onInput(props.id, pickedFile, fileIsValid)
    }

    const pickImageHandler =() => {
        filePickerRef.current.click()
    }

    return <div className="form-control">
        <input 
        id ={props.id}
        ref={filePickerRef} 
        style={{display:'none'}} 
        type="file" 
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler} 
        />
        <div className={`image-upload ${props.center && 'center'}`} >
            <div className='image-upload__preview'>
                {previewUrl && <img src={previewUrl} alt='Preview'/>}
                {!previewUrl && <p>Pick an image</p>}
            </div>
            <Button type='button' onClick={pickImageHandler}>Pick Image</Button>
        </div>
        {!previewUrl && <p>{props.errorText}</p>}
    </div>
}
export default ImageUpload