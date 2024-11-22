import TextCell from "./TextCell";
import ExtCollectionCell from "./ExtCollectionCell";
import NumericCell from "./NumericCell";
import EmailCell from "./EmailCell";
import RegexCell from "./RegexCell";

export const CellType = {
    TEXT: "Text",
    EXTERNAL_COLLECTION: "ExtCollection",
    NUMERIC: "Numeric",
    EMAIL: "Email",
    REGEX: "Regex",
};

const CellRenderer = ({ valueObject, tableId, onChange }) => {
    if (valueObject.cellType === CellType.TEXT) {
      return (
        <TextCell valueObject={valueObject} onChange = {onChange}/>
      );
    } else if (valueObject.cellType === CellType.EXTERNAL_COLLECTION) {
        return (
            <ExtCollectionCell valueObject = {valueObject} tableId = {tableId} onChange = {onChange}/>
        )
    } else if(valueObject.cellType === CellType.NUMERIC){
        return (
        <NumericCell valueObject={valueObject} onChange={onChange}/>
        )
    } else if(valueObject.cellType === CellType.EMAIL){
        return (
            <EmailCell valueObject = {valueObject} onChange = {onChange} />
        )
    } else if(valueObject.cellType === CellType.REGEX){
        return (
            <RegexCell valueObject = {valueObject} onChange= {onChange} />
        )
    }
    else{
        return(
            <div>{valueObject.cellType}</div>
        )
    }
    return null;
};


export default CellRenderer;