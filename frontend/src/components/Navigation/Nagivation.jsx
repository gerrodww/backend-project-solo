import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header className='nav-header'> 
      <div> 
        <ul className='nav-links'>
          <li className='home-link'>
            <NavLink exact to="/"><img src='/logo_size.jpg'/></NavLink>
          </li>
          {isLoaded && (
              <>
              {sessionUser && (
                <li className='drop-links'>
                  <NavLink exact to='/spots/new'><button className='create-spot' >Create a Spot</button></NavLink>
                </li>
              )}
            <li className='drop-links'>
              <ProfileButton user={sessionUser} />
            </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Navigation;