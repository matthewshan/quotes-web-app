import React from 'react';

const apiURL = ''

function QuoteItem({quote}) {
    return <tr>
        <td>{quote.quote}</td>
        <td>{quote.person}</td>
        <td>{quote.dateAdded}</td>
    </tr>;
}

function QuotesTable({quotes}) {
    console.log(quotes)
    return <div className="table-responsive text-left col-lg-12 border p-4 ">
        <h1>Quotes</h1>
        <table className="table table-striped table-sm">
            <thead>
                <tr>
                    <td><b>Quote</b></td>
                    <td><b>By</b></td>
                    <td><b>DateAdded</b></td>
                </tr>
            </thead>
            <tbody>
                {quotes.map((quote) => (
                    <QuoteItem quote={quote} />
                ))}
            </tbody>
        </table>
    </div>;
}

export default function QuoteTable() {

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

    return <div style={{ width:"95%", margin: "0 auto", marginTop: "90px"}}>
        <div className="row">
            <QuotesTable quotes={quotesList}/>
        </div>
    </div>;
}