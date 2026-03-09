import {Routes,Route} from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Home from './home';
import Project from './project-page';
import Task from './task-page';
import Team from './team-page';
import Setting from './setting';
import Dashboard from './dashboard';
import CreateProject from './create-project';


function App() {
  return(
    <Routes>
      <Route path='/' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route element={<Home/>}>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/project-page' element={<Project/>}/>
        <Route path='/task-page' element={<Task/>}/>
        <Route path='/team-page' element={<Team/>}/>
        <Route path='/setting' element={<Setting/>}/>
        <Route path='/create-project' element={<CreateProject/>}/>
      </Route>
    </Routes>
  )
}

export default App
