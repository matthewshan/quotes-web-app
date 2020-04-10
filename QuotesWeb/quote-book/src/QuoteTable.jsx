import React from 'react';

const apiURL = 'localhost:5000'

function QuoteItem({quote}) {
    return <tr>
        <td>{quote.Quote}</td>
        <td>{quote.Person}</td>
        <td>{quote.DateAdded}</td>
    </tr>;
}

function QuotesTable({quotes}) {
    return <div class="table-responsive text-left col-lg-8 border p-4 ">
        <h1>Quotes</h1>
        <table class="table table-striped table-sm">
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

    let getQuotes = (name) => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
        };


        fetch(`${apiURL}//api/getQuotes`, options).then(response => {
          return response.json();
        }).then(data => {
          console.log(data);
          setQuotesList(data);
        });
    };

    React.useEffect(() => getQuotes("Vijay Bhuse"), []);

    return <div style={{ width:"95%", margin: "0 auto", marginTop: "90px"}}>
        <div class="row">
            <QuotesTable quotes={quotesList}/>
        </div>
    </div>;
}