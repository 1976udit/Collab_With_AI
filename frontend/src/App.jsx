import './App.css'
import { UserProvider } from './context/user.context'
import AppRoutes from './routes/appRoutes'
function App() {

  return (
    <UserProvider>
    <AppRoutes />
    </UserProvider>
  )
}

export default App
