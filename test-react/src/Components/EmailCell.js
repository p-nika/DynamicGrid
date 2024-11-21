import {TextField} from '@mui/material'

const EmailCell = ({
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
        <p>This is an email cell</p>
    </div>
  );

export default EmailCell;