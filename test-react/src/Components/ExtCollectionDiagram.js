import FetchTable from "./FetchTables"

const ExtCollectionDiagram = (tableInfo) => {
    return (
        <div>
            {tableInfo.tableId} {tableInfo.rowId}
            <FetchTable id={tableInfo.tableId} removeColumns={false} addColumn={false} rowId = {tableInfo.rowId} editRows={false} viewOnly={true} />
        </div>
    )
}

export default ExtCollectionDiagram