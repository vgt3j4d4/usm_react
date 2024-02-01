import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Iterations } from './components/Iterations/Iterations';
import { Toolbar } from './components/Toolbar/Toolbar';
import { UserStoryMap } from './components/UserStoryMap/UserStoryMap';
import { ROUTES } from "./routes";

function App() {
  return (
    <>
      <Toolbar></Toolbar>
      <main className="mt-14">
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.MAPPING} />}></Route>
          <Route path={ROUTES.MAPPING} element={<UserStoryMap />}></Route>
          <Route path={ROUTES.ITERATIONS} element={<Iterations />}></Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
