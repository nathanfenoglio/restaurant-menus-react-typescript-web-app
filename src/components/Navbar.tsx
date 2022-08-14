import './Navbar.styles.css';

const Navbar = () => {
  return (
    <div>
        <div className='nav-container'>
            <nav className='navbar'>
                <div className='container'>
                    <div className='logo'><a href='/'>Restaurant Menus</a></div>
                    <ul className='nav'>
                        <li>
                            {/* for the restaurant admin to add or remove menu items */}
                            {/* not currently implemented */}
                            {/* <a href='#'>Update Menu</a> */}
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
  )
}

export default Navbar;