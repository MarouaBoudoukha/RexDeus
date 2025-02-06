import '../styles/App.css';
import { Routes, Route } from "react-router-dom";
import Sidebar from './Sidebar';
import AIAgents from "./AIAgents";
import Plugin from "./Plugin";
import Inventory from "./Inventory";
import Wallets from "./Wallets";

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/AIAgents" element={<AIAgents />} />
          <Route path="/Plugin" element={<Plugin />} />
          <Route path="/Inventory" element={<Inventory />} />
          <Route path="/Wallets" element={<Wallets />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Welcome to Rex Deus</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
  );
}

export default App;
