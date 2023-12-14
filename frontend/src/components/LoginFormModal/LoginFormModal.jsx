import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({credential: data.message});
        }
      });
  };

  const handleDemoClick = (e) => {
    e.preventDefault();
    dispatch(sessionActions.login({
        credential: "Reaper",
        password: "password2"
      }))
      .then(closeModal)
  }

  const isFormValid = credential.length >= 4 && password.length >= 6;

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder='Username or Email'
            required
          />
        </label>

        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
        </label>

        {errors.credential && (<p className='error-p'>{errors.credential}</p>)} 

        <button type="submit" className='login' disabled={!isFormValid}>Log In</button>
        <button type="button" className='demo' onClick={handleDemoClick}>Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;