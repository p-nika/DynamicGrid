import {TextField} from '@mui/material'
import { useState } from 'react';

const TextCell = ({
    valueObject,
    onChange
}) => {
    const [inputValue, setInputValue] = useState(valueObject.value || '');

  const handleBlur = (e) => {
    onChange(e.target.value);
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
    </div>
  ) 
}

export default TextCell;