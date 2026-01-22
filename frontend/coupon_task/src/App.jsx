import { useState } from 'react'
import './App.css'
import ComponentLogin from './Components/login'
import ComponentSignup from './Components/signup'
import CouponGenerator from './Components/generate-coupon'
import ValidateCoupon from './Components/validate-coupon'
import OAuthSuccess from './Components/OAuthSuccess'
import Test from './Components/test'
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { HashRouter } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (

    <Routes>
      <Route path='/' element={<ComponentLogin />}></Route>
      <Route path='/signup' element={<ComponentSignup />}></Route>
      <Route path='/generate-coupon' element={<CouponGenerator />}></Route>
      <Route path='/validate-coupon' element={<ValidateCoupon />}></Route>
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/debug-db" element={<OAuthSuccess />} />
      {/*catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>


  )
}

export default App
