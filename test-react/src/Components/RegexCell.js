import {TextField} from '@mui/material'

const RegexCell = ({
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
        <p>This is a regex cell</p>
    </div>
  );

export default RegexCell;