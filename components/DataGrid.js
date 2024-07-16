import React, { useState } from "react";
import { DataGrid, GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import productsData from "../data/productsData.json";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { Rating } from "@mui/material";

const initialRows = productsData.map((product, index) => ({
  id: index,
  ...product,
}));

const ProductDataGrid = () => {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleAddClick = () => {
    const id = rows.length ? rows[rows.length - 1].id + 1 : 0;
    setRows([
      ...rows,
      { id, Nom: "", Référence: "", Prix: 0, Note: 0, isNew: true },
    ]);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const processRowUpdate = (newRow) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? newRow : row
    );
    setRows(updatedRows);
    return newRow;
  };

  const RatingEditInputCell = (props) => {
    const { id, value, field } = props;
    const [ratingValue, setRatingValue] = useState(value);

    const handleRatingChange = (event, newValue) => {
      setRatingValue(newValue);
      props.api.setEditCellValue({ id, field, value: newValue });
    };

    return (
      <Rating
        value={ratingValue}
        onChange={handleRatingChange}
        precision={0.5}
      />
    );
  };

  const renderRatingCell = (params) => {
    return <Rating value={params.value} readOnly precision={0.5} />;
  };

  const columns = [
    { field: "Id", headerName: "ID", width: 90 },
    { field: "Nom", headerName: "Nom", width: 150, editable: true },
    { field: "Référence", headerName: "Référence", width: 150, editable: true },
    {
      field: "Prix",
      headerName: "Prix (€)",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "Note",
      headerName: "Note",
      width: 150,
      editable: true,
      renderCell: renderRatingCell,
      renderEditCell: (params) => <RatingEditInputCell {...params} />,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: "primary.main" }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Button
        startIcon={<AddIcon />}
        onClick={handleAddClick}
        style={{ marginBottom: "10px" }}
      >
        Ajouter une ligne
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        editMode="row"
        processRowUpdate={processRowUpdate}
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
      />
    </div>
  );
};

export default ProductDataGrid;
