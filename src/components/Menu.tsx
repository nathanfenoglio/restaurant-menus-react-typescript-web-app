import { MenuItem } from '../App';
import './Menu.styles.css';
import { useHistory } from 'react-router-dom';

type Props = {
  allMenuItems: MenuItem[];
  restaurantName: string;
  cartItems: MenuItem[];
  addToCart: (selectedMenuItem: MenuItem, diner: number) => void;
  diner: number;
  handleSetDiner: (selectedDiner: number) => void;
  total: number;
  validateCartOuter: () => void;
  removeItemFromCart: (id: number, diner: number) => void;
}

const Menu:React.FC<Props> = (props) => {
  //if no restaurant name is found to filter by return to main page
  const history = useHistory();   
  if(props.restaurantName === ""){
    history.push('/'); 
  }

  const restaurantFilteredMenuItems = props.allMenuItems.filter((menuItem) => {
    return menuItem.restaurant === props.restaurantName;
  });

  const appetizerMenuItems = restaurantFilteredMenuItems.filter((menuItem) => {
    return menuItem.course === "appetizer";
  });

  const mainMenuItems = restaurantFilteredMenuItems.filter((menuItem) => {
    return menuItem.course === "main";
  });

  const dessertMenuItems = restaurantFilteredMenuItems.filter((menuItem) => {
    return menuItem.course === "dessert";
  });

  const onDinerChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleSetDiner(parseInt(event.currentTarget.value));
  }

  return (
    <div className='menu-page'>
      {/* set up side bar for which diner that you are selecting for
      display total, show diner's items and allow ability to delete item */}
      <div className='sidebar-container'>
        <h1>cart</h1>
        <h2 style={{marginTop: "10px"}}>select items for</h2>
        <div className='diner-radio-buttons'>
          <label style={{color: "fuchsia"}}>
            <input 
              type="radio"
              name="select-diner"
              //by default have diner 1 check box checked
              checked={props.diner === 1}
              value={1}
              onChange={(e) => onDinerChangeValue(e)}
            />
            Diner 1
          </label>
          <label style={{color: "yellowgreen"}}>
            <input 
              type="radio"
              name="select-diner"
              value={2}
              onChange={(e) => onDinerChangeValue(e)}
            />
            Diner 2
          </label>
          <div>
            <h2 style={{color: "fuchsia"}}>diner 1 cart items</h2>
              {props.cartItems.map((item) => (
                item.diner === 1 
                  ? <div className='cart-items'><p key={item.id} onClick={() => props.removeItemFromCart(item.id, 1)}>{item.name}</p></div>
                  : <></>                
              ))}
          </div>
          <div>
            <h2 style={{color: "yellowgreen"}}>diner 2 cart items</h2>
              {props.cartItems.map((item) => (
                item.diner === 2
                  ? <div className='cart-items'><p key={item.id} onClick={() => props.removeItemFromCart(item.id, 2)}>{item.name}</p></div>
                  : <></> 
              ))}
          </div>
          <p style={{marginTop: "20px"}}>click on items to remove them</p>
          <div className='total'>
            <h1>Total: ${props.total.toFixed(2)}</h1>
          </div>
          <button onClick={props.validateCartOuter}>check out</button>
        </div>
      </div>
      <div className='menu-items-container'>      
        <div className='headers'>
          <h1>{restaurantFilteredMenuItems[0].restaurant}</h1>
        </div>
        <div className='headers'>
          <h2>Appetizers</h2>
        </div>
        <section className='menu-item-boxes'>
          <div className='container'>
            {appetizerMenuItems?.map((menuItem: MenuItem) => (
              <div 
                className='menu-item-box' 
                key={menuItem.id} 
                onClick={
                  props.diner === 1 
                    ? () => props.addToCart(menuItem, 1) 
                    : () => props.addToCart(menuItem, 2)
                }
              >
                <h2>{menuItem.name}</h2>
                <p>{menuItem.price}</p>
                <p>{menuItem.description}</p>
                <p>{menuItem.qtyavail}</p>
              </div>
            ))}
          </div>
        </section>
        <div className='headers'>
          <h2>Main Course</h2>
        </div>
        <section className='menu-item-boxes'>
          <div className='container'>
            {mainMenuItems?.map((menuItem: MenuItem) => (
                <div 
                  className='menu-item-box' 
                  key={menuItem.id} 
                  onClick={
                    props.diner === 1 
                      ? () => props.addToCart(menuItem, 1) 
                      : () => props.addToCart(menuItem, 2)
                  }
                >
                  <h2>{menuItem.name}</h2>
                  <p>{menuItem.price}</p>
                  <p>{menuItem.description}</p>
                  <p>{menuItem.qtyavail}</p>
                </div>
              ))}
          </div>
        </section>
        <div className='headers'>
          <h2>Desserts</h2>
        </div>
        <section className='menu-item-boxes'>
          <div className='container'>
            {dessertMenuItems?.map((menuItem: MenuItem) => (
                <div 
                  className='menu-item-box' 
                  key={menuItem.id} 
                  onClick={
                    props.diner === 1 
                    ? () => props.addToCart(menuItem, 1) 
                    : () => props.addToCart(menuItem, 2)
                  }
                >
                  <h2>{menuItem.name}</h2>
                  <p>{menuItem.price}</p>
                  <p>{menuItem.description}</p>
                  <p>{menuItem.qtyavail}</p>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Menu