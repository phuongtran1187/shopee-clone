import useRouteElement from './useRouteElement'

function App() {
  const routeElements = useRouteElement()
  return <div className='App'>{routeElements}</div>
}

export default App
