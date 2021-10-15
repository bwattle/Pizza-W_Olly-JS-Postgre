import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';

const App = ()=>{
    return (
        <Button variant="contained">Hello World</Button>
    )
}

const domContainer = document.getElementById('outer-div');
ReactDOM.render(<App />, domContainer);