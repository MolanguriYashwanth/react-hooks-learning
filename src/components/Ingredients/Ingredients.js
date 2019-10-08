import React, { useState,useReducer ,useCallback,useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients,action)=>{
  switch(action.type){
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient.ops[0]]  
    case "DELETE":
      return  currentIngredients.filter((item) => item.id !== action.id) 
      default:
        throw new Error("Shouldnt reach here");
  }
}

const Ingredients = () => {
  const [userIngredients,dispatch] =useReducer(ingredientReducer,[])
  // useEffect(() => {
  //   fetch('http://localhost:8085/my/ingredients/')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       setUserIngredients(responseData);
  //     })
  // }, [])
  //const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading,setLoading]=useState(false);
  const [error,setError]=useState();
  const addIngredientHandler = useCallback(ingredient => {
    setLoading(true);
    fetch("http://localhost:8085/my/ingredients/data",
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        setLoading(false);
        return response.json();
      }).then(responseData => {
        // setUserIngredients(prevIngredients =>
        //   [...prevIngredients, responseData.ops[0]])
        dispatch({type:"ADD",ingredient:responseData})
      }
      )

  },[])
  const removeIngredientHandler = useCallback((title,id) => {
    //const filteredData = userIngredients.filter((item) => item.id !== id);
    setLoading(true);
    fetch(`http://localhost:8085/my/ingredients/delteingrdient?title=${title}`,{
      method: 'DELETE'
    }).then(response=>{
      setLoading(false);
      //setUserIngredients(prevIngredients => prevIngredients.filter((item) => item.id !== id))
      dispatch({type:"DELETE",id:id})
    }).catch(error=>{
      setError(error.message);
      setLoading(false)
    })

  },[])
  const onLoadingIngredientsHandler = useCallback(filteredData => {
    //setUserIngredients(filteredData)
    dispatch({type:"SET",ingredients:filteredData})
  },[]);

  const onErrorHandler = useCallback(() =>{
    setError(null);
  },[])
  const ingredientList = useMemo(()=>{
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />

    )
  },[userIngredients,removeIngredientHandler])
  return (
    <div className="App">
      {error && <ErrorModal onClose={onErrorHandler}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loadingIndicator={isLoading}/>

      <section>
        <Search onLoadingIngredients={onLoadingIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
