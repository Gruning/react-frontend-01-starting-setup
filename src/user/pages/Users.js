import React,{ useEffect, useState} from 'react'
import UsersList from '../components/UsersList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

const Users= ()=>{
    const [isLoading,setIsLoading]=useState(false)
    const [error,setError]= useState() 
    const [loadedUsers,setLoadedUsers]= useState() 
    const USERS = null

    useEffect(()=>{
        const sendRequest = async ()=> {
            setIsLoading(true)
            try {                
                const response = await fetch('http://localhost:5000/api/users/')
                const responseData = await response.json()
                if (!response.ok) {
                    throw new Error(response.message)
                }
                setLoadedUsers(responseData.users)
            } catch (err) {
                setError(err.message)
            }

            setIsLoading(false)
        }
        sendRequest()
    },[])

    const errorHandler = ()=>{
        setError(null)
    }
    //image:'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=75&w=126',
    
    return <React.Fragment>
        <ErrorModal error={error} onClear={errorHandler} />
        {isLoading && (
        <div className='center'>
            <LoadingSpinner/>
        </div>)}
        {!isLoading && loadedUsers && <UsersList items={loadedUsers}/>}

    </React.Fragment>
}
export default Users