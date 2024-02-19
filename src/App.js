import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Iterations } from './components/Iterations/Iterations';
import { StoryMap } from './components/StoryMap/StoryMap';
import { Toolbar } from './components/Toolbar/Toolbar';
import { ROUTES } from "./routes";

function App() {
  return (
    <>
      <Toolbar></Toolbar>
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.MAPPING} />}></Route>
          <Route path={ROUTES.MAPPING} element={<StoryMap />}></Route>
          <Route path={ROUTES.ITERATIONS} element={<Iterations />}></Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
