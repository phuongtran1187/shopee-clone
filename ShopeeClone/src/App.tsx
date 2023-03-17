import useRouteElement from './useRouteElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routeElements = useRouteElement()
  return (
    <div className='App'>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
