import {TextField} from '@mui/material'
import { useState } from 'react';

const TextCell = ({
    valueObject,
    onChange
}) => {
    const [inputValue, setInputValue] = useState(JSON.parse(valueObject.value) || '');
    const [error, setError] = useState(null);
  const handleBlur = (e) => {
    onChange(e.target.value, setError);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <div>
        <TextField
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            variant="outlined"
            size="small"
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  ) 
}

export default TextCell;