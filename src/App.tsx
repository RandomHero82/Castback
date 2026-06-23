import { createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PersonDetail from './pages/PersonDetail'
import Settings from './pages/Settings'
import TitleDetail from './pages/TitleDetail'

// Hash routing keeps profile and settings links functional on static GitHub Pages hosting.
const router = createHashRouter([{ path: '/', element: <Layout/>, children: [
  { index: true, element: <Home/> },
  { path: 'person/:id', element: <PersonDetail/> },
  { path: 'title/:mediaType/:id', element: <TitleDetail/> },
  { path: 'settings', element: <Settings/> },
  { path: '*', element: <div className="grid min-h-[70vh] place-items-center px-5 text-center"><div><p className="eyebrow">404</p><h1 className="mt-3 font-display text-4xl">Scene not found</h1><a href="/" className="button-primary mt-7 inline-flex">Back home</a></div></div> },
]}])

export default function App() { return <RouterProvider router={router}/> }
