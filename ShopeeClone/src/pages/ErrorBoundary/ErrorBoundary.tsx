import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className='flex h-screen w-screen items-center bg-gray-100'>
          <div className='container flex flex-col items-center justify-center px-5 text-gray-700'>
            <div className='max-w-md'>
              <div className='font-dark text-6xl font-bold'>
                Uppsss...
                <strong> 500 </strong>
              </div>
            </div>

            <div className='mt-10 text-2xl font-light leading-normal md:text-3xl'>
              <strong>Something went wrong!</strong>
            </div>

            <a href='/' className='mt-10 inline rounded-lg border border-transparent bg-orange py-2 px-6 text-white'>
              Go home
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
