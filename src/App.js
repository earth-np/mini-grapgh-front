import React, { useState } from 'react';

import './App.css';

import LoginModal from './Components/LoginModal';
import Main from './Views/Main';


function App() {
  const [isLogin,setIsLogin] = useState(true)
  

  return (
    <div className="App">
      {isLogin? <Main/> : <LoginModal setIsLogin={setIsLogin} />}
    </div>
  );
}

export default App;
