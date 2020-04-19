import React from 'react';
import QuoteCard from './QuoteCard';
import QuoteForm from './QuoteForm';
import './quotes.css';
import { useRouteMatch } from 'react-router-dom'
const apiURL = ''

// function QuoteItem({quote}) {
//     return <tr>
//         <td>{quote.quote}</td>
//         <td>{quote.person}</td>
//         <td>{quote.dateAdded}</td>
//     </tr>;
// }

function QuoteView({user}) {
    let match = useRouteMatch()
    let [quotesList, setQuotesList] = React.useState([{quote: 'Loading'}]); 

    let [formQuote, setFormQuote] = React.useState({quote: '', quotee: ''}); 

    let getQuotes = () => {
        fetch(`${apiURL}/api/getQuotes?groupId=${match.params.groupId}`).then(response => {
            if(response.status == 401)
                return 401
            let result = response.json()
            console.log('Result: ' + result);
            return result;
        }).then(payload => {    
          setQuotesList(payload);
        });
    };

    let updateFormQuote = (field, value) => {
        let temp = {...formQuote};
        temp[field] = value;
        setFormQuote(temp);
    }

    let newQuote = () => {
        //POST /api/newQuote - Use the formQuote and add the right header
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
              },
            body: JSON.stringify(formQuote)
        }
        fetch(`/api/addQuote?groupId=${match.params.groupId}`, options).then(response => {
            window.location.reload()
        });
    }

    let addFriend = (event) => {
        let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        let email = prompt("Please enter you're Friend's Email (Associated with their Discord)")
        if(email) {
            if(regex.test(email)) {
                let data = {
                    email: email,
                    groupId: match.params.groupId
                }
                const options = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8'
                      },
                    body: JSON.stringify(data)
                }
                fetch('/api/shareEmail', options)
                .then((response) => {
                    if(response.status == 200)
                        alert("Friend Added!")
                    else
                        alert("Failed to add: " + email)
                    }
                )
            }
            else {
                alert("Invalid Email..")
            }
            
        }
        
    }
    
    React.useEffect(() => getQuotes(), []);

    if(quotesList == 401) {
        return <div className="container bg-3 text-center" style={{marginTop: '65px'}}><h1>You do not have access to this group</h1></div>
    }
    return <div className="container bg-3 text-center" style={{marginTop: '45px'}}>
            <div className="row">
                <QuoteForm currentQuote={formQuote} updateQuote={updateFormQuote} submitQuote={newQuote}/>
            </div>
            <div className="row">
                <a id="shareLink" onClick={addFriend}>+ Add Friends</a>
            </div>
            <div className="row">
                {quotesList.map((quote, i) => (
                    <QuoteCard key={i} quote={quote} />
                ))}
            </div>
    </div>;

        
}




{/* 
    <div style={{ width:"95%", margin: "0 auto", marginTop: "90px"}}>
    <h1>Quotes</h1>
    <div className="table-responsive text-left col-lg-12 border p-4 ">
        <table className="table table-striped table-sm">
            <thead>
                <tr>
                    <td><b>Quote</b></td>
                    <td><b>By</b></td>
                    <td><b>DateAdded</b></td>
                </tr>
            </thead>
            <tbody>
                {quotesList.map((quote) => (
                    <QuoteItem quote={quote} />
                ))}
            </tbody>
        </table>
    </div> */}

export default QuoteView;