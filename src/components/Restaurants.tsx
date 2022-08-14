import React, { SetStateAction }   from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '../App';
import './Restaurants.styles.css';

// with the restaurant selection page need to only grab unique restaurant names/images (don't have images yet, but if you do...)

type Props = {
  allMenuItems: MenuItem[];
  restaurantName: string;
  setRestaurantName: React.Dispatch<SetStateAction<string>>
}

const Restaurants:React.FC<Props> = (props) => {
  //get all of the restaurant names
  let restaurantNames = [] as string[];

  for(let i: number = 0; i < props.allMenuItems.length; i++){
    //if restaurant name is not already found in list, add it
    if(!restaurantNames.includes(props.allMenuItems[i].restaurant)){
      restaurantNames.push(props.allMenuItems[i].restaurant);
    }
  }  

  return (
    <div>
      <section className='menu-item-boxes'>
        <div className='container' onClick={() => console.log("clicked")}>
          {restaurantNames.map((name: string) => (
            <Link to="/menu" style={{ textDecoration: "none" }} key={name}>
              <div className='menu-item-box' onClick={() => props.setRestaurantName(name)}>
                <h1>{name}</h1>
                <p>restaurant description stuff</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Restaurants;