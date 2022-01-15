import logo from './logo.svg';
import './App.css';
// ::ADDED::
import Room from './components/multiplayer/Room';

// ::CHANGED::
function App() {
  return (
    <div className="App">
      <Room /> { /* Call Room component */ }
    </div>
  );
}

export default App;
