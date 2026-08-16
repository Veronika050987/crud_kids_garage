import './App.css';
import GameGarage from './GameGarage';

function App() {
  return (
    <div className="App">    
        <main>
        <GameGarage/>
        </main>

        <footer>
        <p>Copyright &copy; &mdash; {new Date().getFullYear()};
           Nika-studio</p>
      </footer>
    </div>    
  );
}

export default App;
