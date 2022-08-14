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
  //use cart per diner to segregate the items 
  const [cartItemsDiner1, setCartItemsDiner1] = useState([] as MenuItem[]);
  const [cartItemsDiner2, setCartItemsDiner2] = useState([] as MenuItem[]);
  const [diner, setDiner] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  //!!!unable to get validItem set to 0 when handling potential item being added to cart
  const [validItem, setValidItem] = useState<number>(1);

  console.log("cartItemsDiner1");
  console.log(cartItemsDiner1);
  console.log("cartItemsDiner2");
  console.log(cartItemsDiner2);

  const handleAddToCartDiner1 = (selectedMenuItem: MenuItem) => {
    console.log("validItem: " + validItem);

    setCartItemsDiner1((prev) => {
      //There is only one piece of cheesecake left 
      if(selectedMenuItem.qtyavail < 1){
        alert("Sorry, there is no more " + selectedMenuItem.name + " available. Please choose another item.");
        setValidItem(0);
        console.log("should be setting validItem to false here I thought");
        console.log("validItem: " + validItem);
        return [...prev];
      }

      //check if item is already in cart to increase the qty by 1 instead of adding it again
      const itemAlreadyInCart = prev.find(item => item.id === selectedMenuItem.id);
      
      //SHOULD NOT ALLOW ADDING ANOTHER OF THE SAME ITEM
      //SINCE DINER CANNOT HAVE MORE THAN ONE OF THE SAME COURSE ANYWAYS...
      //STILL ADDS TO TOTAL AND SUBTRACTS FROM AVAILABLE QUANTITY DESPITE MY EFFORTS
      if(itemAlreadyInCart){
        setValidItem(0);
        return [...prev];
        // return prev.map(item => (
        //   item.id === selectedMenuItem.id 
        //     ? { ...item, qtyordered: item.qtyordered + 1, qtyavail: item.qtyavail - 1, diner: 1 }
        //     : item
        // ))
      }
      //item is not already in cart so add it to cart with quantity ordered of 1
      //this is just going into the diner's cart so don't need to care about quantity available or quanity ordered
      //can pay attention to that info in the outside of diner carts all menu items array
      //quantity ordered is needed though for computing total
      return [...prev, { ...selectedMenuItem, qtyordered: 1, diner: 1 }];
    })

    //need to figure out how to stop the total from being updated and the quantity being modified
    //below validItem always is true despite my efforts to try to set it to false...
    if(validItem){
      setTotal((prev_total) => {
        return prev_total + selectedMenuItem.price;
      })
      //effect the original menu item objects that are not being put in the diner's carts
      setAllMenuItems((prev) => {
        console.log("what what??");
        return prev.map(item => (
          item.id === selectedMenuItem.id 
            ? { ...item, qtyordered: item.qtyordered + 1, qtyavail: item.qtyavail - 1, diner: 1 }
            : item
        ))
      })  
    }
  };

  const handleAddToCartDiner2 = (selectedMenuItem: MenuItem) => {
    console.log("validItem: " + validItem);

    setCartItemsDiner2((prev) => {
      //There is only one piece of cheesecake left 
      if(selectedMenuItem.qtyavail < 1){
        alert("Sorry, there is no more " + selectedMenuItem.name + " available. Please choose another item.");
        setValidItem(0);
        console.log("should be setting validItem to false here I thought");
        console.log("validItem: " + validItem);

        return [...prev];
      }

      console.log("got here after return prev statement");

      //check if item is already in cart to increase the qty by 1 instead of adding it again
      const itemAlreadyInCart = prev.find(item => item.id === selectedMenuItem.id);

      //SHOULD NOT ALLOW ADDING ANOTHER OF THE SAME ITEM
      //SINCE DINER CANNOT HAVE MORE THAN ONE OF THE SAME COURSE ANYWAYS...
      //STILL ADDS TO TOTAL AND SUBTRACTS FROM AVAILABLE QUANTITY DESPITE MY EFFORTS
      if(itemAlreadyInCart){
        setValidItem(0);
        return [...prev];
        // return prev.map(item => (
        //   item.id === selectedMenuItem.id 
        //     ? { ...item, qtyordered: item.qtyordered + 1, qtyavail: item.qtyavail - 1, diner: 2 }
        //     : item
        // ))
      }
      //item is not already in cart so add it to cart with quantity ordered of 1
      //this is just going into the diner's cart so don't need to care about quantity available or quanity ordered
      //can pay attention to that info in the outside of diner carts all menu items array
      //quantity ordered is needed though for computing total
      return [...prev, { ...selectedMenuItem, qtyordered: 1, diner: 2}];
    })

    //need to figure out how to stop the total from being updated and the quantity being modified
    //below validItem always is true despite my efforts to try to set it to false...
    if(validItem){
      setTotal((prev_total) => {
        return prev_total + selectedMenuItem.price;
      })
  
      //effect the original menu item objects that are not being put in the diner's carts
      setAllMenuItems((prev) => {
        //IT DOES REACH HERE RIGHT OFF THE BAT WITH AN INVALID CHEESECAKE ITEM SELECTION...
        console.log("what what??");
        return prev.map((item) => (
          item.id === selectedMenuItem.id 
            ? { ...item, qtyordered: item.qtyordered + 1, qtyavail: item.qtyavail - 1, diner: 2 }
            : item
        ))
      })
  
    }
  };
  
  const handleSetDiner = (selectedDiner: number) => {
    setDiner(selectedDiner);  
  }

  //validate each diner's cart
  const validateCartOuter = () => {
    validateCart(cartItemsDiner1, 1);
    validateCart(cartItemsDiner2, 2);
  }
  const validateCart = (oneDinerCart: MenuItem[], dinerNum: number) => {
    //rules
    //Each person must have at least two courses, one of which must be a main
    //Each diner cannot have more than one of the same course
    let cartIsValid: boolean = true;

    //count # of course types in cart
    let numAppetizerCourseItems: number = 0;
    let numMainCourseItems: number = 0;
    let numDessertCourseItems: number = 0;
    for(let i = 0; i < oneDinerCart.length; i++){
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
    console.log("numAppetizerCourseItems: " + numAppetizerCourseItems);
    console.log("numMainCourseItems: " + numMainCourseItems);
    console.log("numDessertCourseItems: " + numDessertCourseItems);
    
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
      if(oneDinerCart[i].doesNotPairWellWith){
        for(let j = 0; j < oneDinerCart[i].doesNotPairWellWith.length; j++){
          for(let k = 0; k < oneDinerCart.length; k++){
            if(oneDinerCart[k].name === oneDinerCart[i].doesNotPairWellWith[j]){
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

  const removeItemFromCartDiner1 = (id: number) => {
    //change qtyordered, qtyavail to reflect the removal of the item from a cart
    setAllMenuItems(prev => {
      return prev.map(item => (
        item.id === id
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
    setCartItemsDiner1(prev => (
      prev.reduce((acc, item) => {
        if(item.id === id){
          return acc;
        }
        else{
          return [...acc, item]
        }
      }, [] as MenuItem[])
    ))
  };

  const removeItemFromCartDiner2 = (id: number) => {
    //change qtyordered, qtyavail to reflect the removal of the item from a cart
    setAllMenuItems(prev => {
      return prev.map(item => (
        item.id === id
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
    setCartItemsDiner2(prev => (
      prev.reduce((acc, item) => {
        if(item.id === id){
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
            cartItemsDiner1={cartItemsDiner1}
            handleAddToCartDiner1={handleAddToCartDiner1}
            cartItemsDiner2={cartItemsDiner2}
            handleAddToCartDiner2={handleAddToCartDiner2}
            diner={diner}
            handleSetDiner={handleSetDiner}
            total={total}
            validateCartOuter={validateCartOuter}
            removeItemFromCartDiner1={removeItemFromCartDiner1}
            removeItemFromCartDiner2={removeItemFromCartDiner2}
          />
        </Route>
    </BrowserRouter>
  );
}

export default App;
