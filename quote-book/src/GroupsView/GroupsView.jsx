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
            }).then(data => {    
                console.log("Payload: " + data);
                setGroupsList(data);
            });
        });
    };

    let newGroup = (event) => {
        event.preventDefault();
        
        const name = document.getElementById('formName').value;

        let options = {
            method: 'POST'
        }

        fetch(`/api/newGroup?groupName=${name}`, options).then(response => {
            if(response.status == 200) {
                alert("Group added")
            }
            else {
                alert("Failed to add group")
            }
                
            //  Alert on success or failure. Refresh page if successful
        })
    }
    
    React.useEffect(() => getGroups(), []);

    function onSelect(event) {
        let group = event.target.value;
        if (group != "---") {
            window.location.href = `/notebook/${group}`;
        }
    }

    return <div id="groupsView" className="container card m-auto w-75 w-sm-25 py-4" style={{marginTop: '40px'}}>
                <h2>Select a Group</h2>
                <select className="groupSelect" onChange={onSelect}>
                    <option value="---"></option>
                    {
                        groupsList.map((item, i) => <GroupItem key={i} id={item.groupId} name={item.name}/>)
                    }
                </select>
                <hr />
                <h4>or Create a Group</h4>
                <form onSubmit={newGroup}>
                    <div class="form-group">
                        <label>Name</label>
                        <input id="formName" class="form-control form-control-sm" type="text"></input>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
}

export default GroupsView;
