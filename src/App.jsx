import React, { Suspense } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react-pro'
import { Provider } from 'react-redux'
import store from './redux/store'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const ProtectedRoute = React.lazy(() => import('./middlewares/ProtectedRoute'))

const App = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="*" element={<ProtectedRoute element={<DefaultLayout />} />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </Provider>
  )
}

export default App
