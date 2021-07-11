import React, { useState, useContext } from 'react'

import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import './Auth.css'

const Auth = () => {
    const auth = useContext(AuthContext)
    const [isLoginMode, setIsLoginMode] = useState(true)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false,
            },
            password: {
                value: '',
                isValid: false,
            },
        },
        false
    )
    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            )
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false,
                    },
                    image: {
                        value: null,
                        isValid: false,
                    },
                },
                false
            )
        }
        setIsLoginMode((prevMode) => !prevMode)
    }
    const authSubmitHandler = async (e) => {
        e.preventDefault()
        console.log(formState.inputs)

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BAKEND_URL + '/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        'Content-Type': 'application/Json',
                    }
                )
                auth.login(responseData.userId, responseData.token)
            } catch (err) {}
        } else {
            try {
                const formData = new FormData()
                formData.append('email', formState.inputs.email.value)
                formData.append('name', formState.inputs.name.value)
                formData.append('password', formState.inputs.password.value)
                formData.append('image', formState.inputs.image.value)
                const responseData = await sendRequest(
                    process.env.REACT_APP_BAKEND_URL + '/users/signup',
                    'POST',
                    formData
                )
                auth.login(responseData.userId, responseData.token)
            } catch (err) {}
        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className='authentication'>
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element='input'
                            id='name'
                            type='text'
                            label='Username'
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText='Username is required'
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && (
                        <ImageUpload
                            center
                            id='image'
                            onInput={inputHandler}
                            errorText='Image required'
                        />
                    )}
                    <Input
                        element='input'
                        id='email'
                        type='email'
                        label='E-Mail'
                        validators={[VALIDATOR_EMAIL()]}
                        errorText='Enter a valid email address'
                        onInput={inputHandler}
                    />
                    <Input
                        element='input'
                        id='password'
                        type='password'
                        label='Password'
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText='Enter a valid password. At least 6 charcaters'
                        onInput={inputHandler}
                    />
                    <Button type='submit' disabled={!formState.isValid}>
                        {isLoginMode ? 'Login' : 'Signup'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    Switch to {isLoginMode ? 'Signup' : 'Login'}
                </Button>
            </Card>
        </React.Fragment>
    )
}

export default Auth
