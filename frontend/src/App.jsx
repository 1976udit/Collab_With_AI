import './App.css'
import { UserProvider } from './context/user.context'
import AppRoutes from './routes/appRoutes'
import { ToastContainer } from 'react-toastify'
function App() {

  return (
    <UserProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
      />
      <AppRoutes />
    </UserProvider>
  );
}

export default App
