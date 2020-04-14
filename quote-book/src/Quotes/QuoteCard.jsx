import React from 'react';
import styles from './quotes.css';
/*
    Quote Reference

    Quote:
        id, quote, person, author, dataAdded, source, groupId


*/

function QuoteCard({quote}) {
    return <div className="quoteCard col-12 col-sm-6 my-3">
            <div className="card w-100 h-100 p-5">
                <p className="m-auto text-break">
                    {quote.quote}
                </p>
                <p className="personName">~{quote.person}</p>
            </div>
    </div>
}

export default QuoteCard;