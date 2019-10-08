import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from "../UI/LoadingIndicator";

const IngredientForm = React.memo(props => {
  //const [initialState,setInputState] = useState({ title: '', amount: '' });
  const [enteredTitle,setEnteredTitle]=useState('');
  const [eneteredAmount,setEnteredAmount]=useState('');
  const submitHandler = event => {
    event.preventDefault();
    let ingredientObj={
      title:enteredTitle,
      amount:eneteredAmount
    }
    props.onAddIngredient(ingredientObj)
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            {/* <input type="text" id="title" value={initialState.title}
              onChange={(event) => {
                const newTitle = event.target.value;
                setInputState(previousState => (
                  { title: newTitle, amount: previousState.amount }))
              }} /> */}
              <input type="text" id="title" value={enteredTitle} onChange={event =>{setEnteredTitle(event.target.value)}}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={eneteredAmount} onChange={event =>{setEnteredAmount(event.target.value)}}/>

            {/* <input type="number" id="amount" value={initialState.amount}
              onChange={event => {
                const newAmount = event.target.value;
                setInputState(previousState => (
                  { amount: newAmount, title: previousState.title }))
              }} /> */}
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loadingIndicator && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
