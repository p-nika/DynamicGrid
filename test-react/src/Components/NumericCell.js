import {TextField} from '@mui/material'

const NumericCell = ({
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
        <p>This is numeric cell</p>
    </div>
  );

export default NumericCell;