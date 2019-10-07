import React, { useState,useEffect ,useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadingIngredients} = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  useEffect(()=>{
    const timer =setTimeout(()=>{
      if(enteredFilter===inputRef.current.value){
        let url="";
        if(enteredFilter.length>0){
          url='http://localhost:8085/my/ingredients/title?title='+enteredFilter
        }else{
          url='http://localhost:8085/my/ingredients/'
        }
        fetch(url)
        .then(response=>response.json())
        .then(responseData=>{
          onLoadingIngredients(responseData)
        })
      }
    },500)
    return () => {
      clearTimeout(timer);
    }
  
  },[enteredFilter,onLoadingIngredients,inputRef])
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text"
          ref={inputRef}
           value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
