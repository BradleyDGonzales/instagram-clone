import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Main from './components/Main';
import Profile from './components/Profile';
import Upload from './components/Upload';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/main' element={<Main />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/userprofile' element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
