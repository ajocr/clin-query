import { useState } from 'react';
import { Login } from './components/Login';
import { PatientSearch } from './components/PatientSearch';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientSearch />
    </div>
  );
}