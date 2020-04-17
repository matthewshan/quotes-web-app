import React from 'react';
import './GroupsView.css'

function GroupItem({id, name}) {
    return <option value={id}>{name}</option>
}

function GroupsView({user}) {

    let [groupsList, setGroupsList] = React.useState([{}]); 

    let getGroups = () => {
        fetch(`/api/addDiscordGroups`).then(response => {
            fetch(`/api/userGroups`).then(response => {
                let result = response.json()
                console.log('Result: ' + result);
                return result;
            }).then(payload => {    
              setGroupsList(payload);
            });
        });
    };
    
    React.useEffect(() => getGroups(), []);

    function onSelect(event) {
        let group = event.target.value;
        if (group != "---") {
            window.location.href = `/notebook/${group}`;
        }
    }

    return <div id="groupsView" className="container card m-auto w-75 w-sm-25 py-4" style={{marginTop: '40px'}}>
                <h2>Select a Group</h2>
                <select className="" onChange={onSelect}>
                    <option value="---">---</option>
                    {
                        groupsList.map((item, i) => <GroupItem key={i} id={item.id} name={item.name}/>)
                    }
                </select>
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"> + Create New Group</a>
            </div>
}

export default GroupsView;
