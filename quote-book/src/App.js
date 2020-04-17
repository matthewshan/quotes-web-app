import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import QuotesView from './Quotes/QuotesView';
import GroupsView from './GroupsView/GroupsView';
import Nav from './Nav/NavBar';
import { BrowserRouter, Router, Route, Switch, useRouteMatch } from 'react-router-dom'

function App() {
  let [user, setUser] = React.useState({id: 0, email: "johndoe@gmail.com", discordId: "", facebookId: ""}); 

  // let getUser = () => {
  //     fetch(`/api/getCurrentUser`).then(response => {
  //         let result = response.json()
  //         return result;
  //     }).then(payload => {    
  //       setUser(payload);
  //     });
  // };
  
  // React.useEffect(() => getUser(), []);
  return (<div>   
    
      <Switch>
        <Route exact path="/">
          <Nav user={user}/>
          <GroupsView />
        </Route>
        <Route path="/notebook/:groupId"> 
          <Nav user={user}/>
          <QuotesView />
        </Route> 
      </Switch>
    </div>
  );
}

export default App;
