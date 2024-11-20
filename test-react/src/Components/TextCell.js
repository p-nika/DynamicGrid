import {TextField} from '@mui/material'

const TextCell = ({
    valueObject,
    onChange
}) => (
    <TextField
      value={valueObject.value || ''}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      size="small"
    />
  );

export default TextCell;