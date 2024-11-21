import {TextField} from '@mui/material'

const TextCell = ({
    valueObject,
    onChange
}) => (
    <div>
      <TextField
        value={valueObject.value || ''}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        size="small"
      />
      <p>This is a text cell</p>
    </div>
  );

export default TextCell;