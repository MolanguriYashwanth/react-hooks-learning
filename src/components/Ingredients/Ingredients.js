import React, { useState, useEffect ,useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {
  // useEffect(() => {
  //   fetch('http://localhost:8085/my/ingredients/')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       setUserIngredients(responseData);
  //     })
  // }, [])
  const [userIngredients, setUserIngredients] = useState([]);
  const addIngredientHandler = ingredient => {
    fetch("http://localhost:8085/my/ingredients/data",
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then(responseData => {
        console.log("Response Data", responseData.ops[0]);
        setUserIngredients(prevIngredients =>
          [...prevIngredients, responseData.ops[0]])
      }
      )

  }
  const removeIngredientHandler = id => {
    //const filteredData = userIngredients.filter((item) => item.id !== id);
    setUserIngredients(prevIngredients => prevIngredients.filter((item) => item.id !== id))

  }
  const onLoadingIngredientsHandler = useCallback(filteredData => {
    setUserIngredients(filteredData)
  },[])
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadingIngredients={onLoadingIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
