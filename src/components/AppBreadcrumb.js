import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react-pro'

import routes from '../routes'

const AppBreadcrumb = ({ route }) => {
  const currentLocation = useLocation().pathname

  // Function to check if the route exists
  const routeExists = (pathname, routes) => {
    return routes.some(route => route.path === pathname)
  }

  // Function to get the name of the route
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find(route => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  // Function to get breadcrumbs based on location
  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`.replace(/\/+$/, '') // Remove trailing slashes
      const routeName = getRouteName(currentPathname, routes)
      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length,
        })
      }
      return currentPathname
    }, '')
    return breadcrumbs
  }

  // Check if the route exists
  if (!routeExists(currentLocation, routes)) {
    return <Navigate to="/404" replace /> 
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <>
      <div className="fs-5 ">{breadcrumbs.length > 0 && breadcrumbs[breadcrumbs.length - 1].name}</div>
      <CBreadcrumb className="mb-4">
        <CBreadcrumbItem href="/">{('Inicio')}</CBreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        ))}
      </CBreadcrumb>
    </>
  )
}

export default React.memo(AppBreadcrumb)
