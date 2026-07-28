import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Planner from './pages/Planner'
import Classify from './pages/Classify'
import Chatbot from './pages/Chatbot'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/planner" element={<Planner />} />
      <Route path="/classify" element={<Classify />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App
