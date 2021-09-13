import { useRef, useState } from 'react';
import './login.css';
import { Cancel } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const Login = ({ setShowLogin, myStorage, setCurrentUsername }) => {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post('/users/login', user);
      console.log(res.data);
      setCurrentUsername(res.data.username);
      myStorage.setItem('user', res.data.username);
      setShowLogin(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="login-logo">LOGIN</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="popup-input"
          placeholder="username..."
          ref={usernameRef}
        />
        <input
          type="password"
          className="popup-input"
          placeholder="password..."
          ref={passwordRef}
        />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
};

export default Login;
