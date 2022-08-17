import { useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Restaurants from './components/Restaurants';
import Menu from './components/Menu';

export type MenuItem = {
  id: number;
  restaurant: string;
  name: string;
  price: number;
  description: string;
  qtyavail: number;
  qtyordered: number;
  course: string;
  diner: number;
  doesNotPairWellWith: string[];
};

const getAllMenus = async (): Promise<MenuItem[]> => {
  return await (await fetch("http://localhost:8000/menus")).json();
}

const numDiners: number = 2;

function App() {
  const [allMenuItems, setAllMenuItems] = useState([] as MenuItem[]);
  //get all of the restaurant menus data from json-server
  useEffect(() => {
    const data: Promise<MenuItem[]> = getAllMenus();
    data.then((oneMenuItem: MenuItem[]) => setAllMenuItems(oneMenuItem));
  }, []); //[] will cause useEffect to fire off once initially, then never again

  console.log("allMenuItems");
  console.log(allMenuItems);

  const [restaurantName, setRestaurantName] = useState<string>("");
  //pay attention to diner # to distinguish which diner an item belongs to
  const [cartItems, setCartItems] = useState([] as MenuItem[]);
  const [diner, setDiner] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  console.log("cartItems");
  console.log(cartItems);

  //takes in the diner # so can associate item to diner
  const addToCart = (selectedMenuItem: MenuItem, diner: number) => {
    //if either of the 2 below conditions are met, the item selection is invalid
    //so return out of function and do not set any items for the cart

    //There is only one piece of cheesecake left 
    if(selectedMenuItem.qtyavail < 1){
      alert("Sorry, there is no more " + selectedMenuItem.name + " available. Please choose another item.");
      return; //just return no state should change at this point
    }

    //diner cannot have more than one of the same item or course
    if(cartItems.find(item => selectedMenuItem.id === item.id && selectedMenuItem.diner === diner)){
      alert("item not added as it is already in cart");
      return;
    }

    setCartItems((prev) => {
      //item is not already in cart so add it to cart with quantity ordered of 1
      //this is just going into the diner's cart so don't need to care about quantity available or quantity ordered
      //can pay attention to that info in the outside of diner carts all menu items array
      return [...prev, { ...selectedMenuItem, qtyordered: 1, diner: diner }];
    })

    //will have returned earlier before the setCartItems call and would not reach here unless the item fits the constraints 
    setTotal((prev_total) => {
      return prev_total + selectedMenuItem.price;
    })

    //update quantity ordered and quantity available for 
    //the original menu item objects that are not being put in the diner's carts
    setAllMenuItems((prev) => {
      return prev.map(item => (
        item.id === selectedMenuItem.id 
          ? { ...item, qtyordered: item.qtyordered + 1, qtyavail: item.qtyavail - 1, diner: diner }
          : item
      ))
    })  
  };
  
  const handleSetDiner = (selectedDiner: number) => {
    setDiner(selectedDiner);  
  }

  //validate each diner's cart seperately
  const validateCartOuter = () => {
    for(let i = 1; i <= numDiners; i++){
      validateCart(cartItems, i);
    }
  }

  const validateCart = (oneDinerCart: MenuItem[], dinerNum: number) => {
    //validate rules
    let cartIsValid: boolean = true;

    //must have 2 courses 1 of which must be the main course 
    //count # of course types in cart
    let numAppetizerCourseItems: number = 0;
    let numMainCourseItems: number = 0;
    let numDessertCourseItems: number = 0;
    for(let i = 0; i < oneDinerCart.length; i++){
      if(oneDinerCart[i].diner === dinerNum){ //ADDED
        if(oneDinerCart[i].course === "appetizer"){
          numAppetizerCourseItems++;
        }
        else if(oneDinerCart[i].course === "main"){
          numMainCourseItems++;
        }
        else if(oneDinerCart[i].course === "dessert"){
          numDessertCourseItems++;
        }
      }
    }
    
    //Each person must have at least two courses
    let numCourses: number = 0;
    if(numAppetizerCourseItems > 0){
      numCourses++;
    }
    if(numMainCourseItems > 0){
      numCourses++;
    }
    if(numDessertCourseItems > 0){
      numCourses++;
    }
    if(numCourses < 2){
      cartIsValid = false;
      alert("Each diner must have at least 2 courses");
    }

    //Each diner cannot have more than one of the same course
    if(numAppetizerCourseItems > 1 || numDessertCourseItems > 1){
      cartIsValid = false;
      alert("Each diner cannot have more than one of the same course");
    }
    //one of which must be a main
    if(numMainCourseItems !== 1){
      cartIsValid = false;
      alert("Must order exactly 1 main course from the menu, no more, no less");
    }

    //Pierre the snobby waiter will not let you have prawn cocktail and salmon fillet in the same meal
    for(let i = 0; i < oneDinerCart.length; i++){
      if(oneDinerCart[i].diner === dinerNum){ //check if cart item is associated with diner's cart that you're validating
          for(let j = 0; j < oneDinerCart[i].doesNotPairWellWith.length; j++){ //check for each item that the item would not pair well with
            for(let k = 0; k < oneDinerCart.length; k++){ //check each item in the diner's cart for an offensive combo
              if(oneDinerCart[k].name === oneDinerCart[i].doesNotPairWellWith[j] && oneDinerCart[k].diner === dinerNum){
                cartIsValid = false;
                alert("Hey diner " + dinerNum + ": It is highly recommended that you do not pair " + oneDinerCart[k].name + " with " + oneDinerCart[i].name + ". In fact we will not accept your order as it currently is.");
              }
            }
          }
      }
    }

    //cart is within the constraints and is accepted
    if(cartIsValid){
      alert("Thank you diner " + dinerNum + "! Check out checks out. We'll have your meal out soonish.");
    }

  }

  const removeItemFromCart = (id: number, diner: number) => {
    //change qtyordered, qtyavail to reflect the removal of the item from a cart
    setAllMenuItems(prev => {
      return prev.map(item => (
        item.id === id && item.diner === diner
          ? {...item, qtyordered: item.qtyordered - 1, qtyavail: item.qtyavail + 1}
          : item
      ))
    })

    //reduce total
    setTotal(prev => {
      let priceOfItemBeingRemoved = 0;
      for(let i = 0; i < allMenuItems.length; i++){
        if(allMenuItems[i].id === id){
          priceOfItemBeingRemoved = allMenuItems[i].price;
        }
      }
      return prev - priceOfItemBeingRemoved;
    })

    //remove from cart
    setCartItems(prev => (
      prev.reduce((acc, item) => {
        if(item.id === id && item.diner == diner){
          return acc;
        }
        else{
          return [...acc, item]
        }
      }, [] as MenuItem[])
    ))
  };

  return (
    <BrowserRouter>
      <Navbar/>
        <Route path='/' exact>
          <Restaurants 
            allMenuItems={allMenuItems} 
            restaurantName={restaurantName} 
            setRestaurantName={setRestaurantName}
          />
        </Route>
        <Route path='/menu' exact>
          <Menu 
            allMenuItems={allMenuItems} 
            restaurantName={restaurantName}
            cartItems={cartItems}
            addToCart={addToCart}
            diner={diner}
            handleSetDiner={handleSetDiner}
            total={total}
            validateCartOuter={validateCartOuter}
            removeItemFromCart={removeItemFromCart}
          />
        </Route>
    </BrowserRouter>
  );
}

export default App;
