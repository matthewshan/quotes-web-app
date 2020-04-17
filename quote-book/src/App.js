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
  let [user, setUser] = React.useState({id: "", email: "", discordId: "", facebookId: ""}); 

  let getUser = () => {
      fetch(`/api/getUser`).then(response => {
          let result = response.body
          return result;
      }).then(payload => {    
        console.log(payload)
        setUser(payload);
      });
  };
  React.useEffect(() => getUser(), []);

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
