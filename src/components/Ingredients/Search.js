import React, { useState,useEffect ,useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const Search = React.memo(props => {
  const {onLoadingIngredients} = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(()=>{
    const timer =setTimeout(()=>{
      if(enteredFilter===inputRef.current.value){
        let url="";
        if(enteredFilter.length>0){
          url='http://localhost:8085/my/ingredients/title?title='+enteredFilter
        }else{
          url='http://localhost:8085/my/ingredients/'
        }
        // fetch(url)
        // .then(response=>response.json())
        // .then(responseData=>{
        //   onLoadingIngredients(responseData)
        // })
        sendRequest(
          url,
          'GET'
        );
      }
    },500)
    return () => {
      clearTimeout(timer);
    }
  
  },[enteredFilter,sendRequest,inputRef])

  useEffect(() => {
    if (!isLoading && !error && data) {
      onLoadingIngredients(data);
    }
  }, [data, isLoading, error, onLoadingIngredients]);
  return (
    <section className="search">
            {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input type="text"
          ref={inputRef}
           value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
