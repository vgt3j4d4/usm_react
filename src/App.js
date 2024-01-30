import './App.css';
import { Toolbar } from './components/Toolbar/Toolbar';
import { UserStoryMap } from './components/UserStoryMap/UserStoryMap';
import { Iterations } from './components/Iterations/Iterations';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Toolbar></Toolbar>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/mapping" />}></Route>
          <Route path="/mapping" element={<UserStoryMap />}></Route>
          <Route path="/iterations" element={<Iterations />}></Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
