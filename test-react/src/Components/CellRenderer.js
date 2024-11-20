import TextCell from "./TextCell";
import ExtCollectionCell from "./ExtCollectionCell";

const CellType = {
    TEXT: "Text",
    EXTERNAL_COLLECTION: "ExtCollection",
};

const CellRenderer = ({ valueObject, onChange }) => {
    if (valueObject.cellType === CellType.TEXT) {
      return (
        <TextCell valueObject={valueObject} onChange = {onChange}/>
      );
    } else if (valueObject.cellType === CellType.EXTERNAL_COLLECTION) {
        return (
            <ExtCollectionCell valueObject = {valueObject} onChange = {onChange}/>
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