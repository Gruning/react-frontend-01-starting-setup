import { set } from "lodash"
import { useState ,useCallback,useRef} from "react"

export const useHttpClient = ()=> {
    const [isLoading,setIsLoading]= useState(false)
    const [error,setError]= useState()
    const activeHttpRequest = useRef([])

    const sendRequest = useCallback((
        url,
        method='GET',
        body=null,
        headers={}
        )=>{
        setIsLoading(true)
        try {
            
            const response= await fetch(url,{
                method,
                body,
                headers
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responsedata.message)
            }
        } catch (err) {
            setError(err.message)
        }
        setIsLoading(false)
    },
    []
    )
        const clearError=()=>{
            setError(null)
        }
        return {isLoading, error, sendRequest}
    
    
}