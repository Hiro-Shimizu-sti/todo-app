import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodoList from './components/TodoList';
import TodoDetail from './components/TodoDetail';
import MuiTestPage from './components/MuiTestPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/todo/:id" element={<TodoDetail />} />
          <Route path="/test" element={<MuiTestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;