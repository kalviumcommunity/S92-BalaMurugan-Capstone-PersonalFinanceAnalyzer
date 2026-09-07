import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="app-content">
        <h1>Welcome to SpendLens</h1>
        <p>Your personal finance analyzer.</p>
      </main>

      <Footer />
    </div>
  );
}

export default App;