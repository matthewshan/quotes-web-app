import React from 'react';
import './quotes.css';

function QuoteForm({currentQuote, updateQuote, submitQuote}) {

    let submit = (event) => {
        event.preventDefault();
        submitQuote()
    }
    return <div class="col-lg-12 border p-4 text-left">
        <h2> New Quote </h2>
        <form onSubmit={submit}>
            <div class="form-group">
                <label>Quote</label>
                <input class="form-control form-control-sm" type="text" value={currentQuote.quote} onChange={(event) => updateQuote('quote', event.target.value)} ></input>
            </div>
            <div class="form-group">
                <label>Quotee</label>
                <input class="form-control form-control-sm" type="text" value={currentQuote.quotee} onChange={(event) => updateQuote('quotee', event.target.value)} ></input>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>;
}

export default QuoteForm;