import React from 'react';
import QuoteCard from './QuoteCard';
import styles from './quotes.css';
const apiURL = ''

// function QuoteItem({quote}) {
//     return <tr>
//         <td>{quote.quote}</td>
//         <td>{quote.person}</td>
//         <td>{quote.dateAdded}</td>
//     </tr>;
// }

function QuoteView({user}) {

    let [quotesList, setQuotesList] = React.useState([]); 

    let getQuotes = () => {
        fetch(`${apiURL}/api/getQuotes`).then(response => {
            let result = response.json()
            console.log('Result: ' + result);
            return result;
        }).then(payload => {    
          setQuotesList(payload);
        });
    };
    
    React.useEffect(() => getQuotes(), []);

    return <div className="container bg-3 text-center">
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