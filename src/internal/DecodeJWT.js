import { jwtDecode } from 'jwt-decode'

export const DecodeJWT = () => {
   try {
      if (!localStorage.getItem('air_port_token')) return false
      const token = localStorage.getItem('air_port_token')

      const decode = jwtDecode(token)
      return decode
   }
   catch (error) {
      localStorage.removeItem('air_port_token')
      window.location.reload()
      alert('invalid token')
      return null
   }
}