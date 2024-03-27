# Restaurant Menus React Typescript Web App
Web App using TypeScript and React 
that displays restaurants for user to select from 
and allows user to select menu items for 2 diners with certain rule constraints enforced 
with ability to delete menu items previously selected  

## Compilation Instructions
#### back end:
in root directory of project <br/>
npx json-server --watch data/restaurant_menus.json --port 8000 <br/>
to run <br/>
json-server for restaurant data locally

#### front end:
to create front end project <br/>
npx create-react-app restaurant_menu --template typescript <br/>
npm install react-router-dom@5 to install version 5 <br/>
npm install --save @types/react-router-dom@5 <br/> 

npm start (in terminal)
