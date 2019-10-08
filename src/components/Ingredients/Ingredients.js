import React, { useState,useEffect, useReducer, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttp from '../../hooks/http';


const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient.ops[0]]
    case "DELETE":
      return currentIngredients.filter((item) => item.id !== action.id)
    default:
      throw new Error("Shouldnt reach here");
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  // useEffect(() => {
  //   fetch('http://localhost:8085/my/ingredients/')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       setUserIngredients(responseData);
  //     })
  // }, [])
  //const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading,setLoading]=useState(false);
  // const [error,setError]=useState();

  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifer,
    clear
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifer === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifer === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: data
      });
    }
  }, [data, reqExtra, reqIdentifer, isLoading, error]);

  // const addIngredientHandler = useCallback(ingredient => {
  //   setLoading(true);
  //   fetch("http://localhost:8085/my/ingredients/data",
  //     {
  //       method: 'POST',
  //       body: JSON.stringify(ingredient),
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     }).then((response) => {
  //       setLoading(false);
  //       return response.json();
  //     }).then(responseData => {
  //       // setUserIngredients(prevIngredients =>
  //       //   [...prevIngredients, responseData.ops[0]])
  //       dispatch({ type: "ADD", ingredient: responseData })
  //     }
  //     )

  // }, [])

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'http://localhost:8085/my/ingredients/data',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);
  
  // const removeIngredientHandler = useCallback((title, id) => {
  //   //const filteredData = userIngredients.filter((item) => item.id !== id);
  //   setLoading(true);
  //   fetch(`http://localhost:8085/my/ingredients/delteingrdient?title=${title}`, {
  //     method: 'DELETE'
  //   }).then(response => {
  //     setLoading(false);
  //     //setUserIngredients(prevIngredients => prevIngredients.filter((item) => item.id !== id))
  //     dispatch({ type: "DELETE", id: id })
  //   }).catch(error => {
  //     setError(error.message);
  //     setLoading(false)
  //   })

  // }, [])

  const removeIngredientHandler = useCallback(
    (title, id) => {
      sendRequest(
        `http://localhost:8085/my/ingredients/delteingrdient?title=${title}`,
        'DELETE',
        null,
        id,
        'REMOVE_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const onLoadingIngredientsHandler = useCallback(filteredData => {
    //setUserIngredients(filteredData)
    dispatch({ type: "SET", ingredients: filteredData })
  }, []);


  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />

    )
  }, [userIngredients, removeIngredientHandler])
  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loadingIndicator={isLoading} />

      <section>
        <Search onLoadingIngredients={onLoadingIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
