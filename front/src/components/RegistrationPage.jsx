import React, { useState } from 'react'
import axios from 'axios'
// import './App.css'

const RegistrationPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleRegistration = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('/api/register', { username, password })
      // Handle successful registration
      console.log(response.data)
    } catch (error) {
      // Handle registration error
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleRegistration}>
      <input
        className='inputBox'
        type='text'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className='inputBox'
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className='button' type='submit'>
        Register
      </button>
    </form>
  )
}

export default RegistrationPage
