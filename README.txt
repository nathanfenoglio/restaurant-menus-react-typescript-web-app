Web App using TypeScript and React 
that displays restaurants for user to select from 
and allows user to select menu items for 2 diners with certain rule constraints enforced 
with ability to delete menu items previously selected  

back end:
in root directory of project
npx json-server --watch data/restaurant_menus.json --port 8000
to run json-server for restaurant data locally

front end:
to create front end project
npx create-react-app restaurant_menu --template typescript 
npm install react-router-dom@5 to install version 5
npm install --save @types/react-router-dom@5

cd directory to react_front_end_save_graphs_1/react_front_end_save_graphs_1/
npm start (in terminal)
