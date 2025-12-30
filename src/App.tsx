import { StandupForm } from './components/StandupForm';
import { NewStandupEntry } from './types/standup';

function App() {
  const handleSubmit = (entry: NewStandupEntry) => {
    console.log('Submitted entry:', entry);
  };

  return (
    <div className="app">
      <h1>Daily Standup Tracker</h1>
      <StandupForm onSubmit={handleSubmit} />
    </div>
  )
}

export default App
