import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { Rating } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeProducts,
  addProductToStore,
  updateProductInStore,
  deleteProductFromStore,
} from "../reducers/products";
import productsData from "../data/productsData.json";

const ProductDataGrid = () => {
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.products.value);
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    dispatch(initializeProducts(productsData));
  }, []);

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
  };

  const handleDeleteClick = (id) => () => {
    dispatch(deleteProductFromStore(id));
  };

  const handleAddClick = () => {
    const newId = rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 0;
    dispatch(
      addProductToStore({ id: newId, Nom: "", Référence: "", Prix: 0, Note: 0 })
    );
    setRowModesModel({
      ...rowModesModel,
      [newId]: { mode: GridRowModes.Edit },
    });
  };

  const processRowUpdate = (newRow) => {
    const { id, ...updatedProduct } = newRow;
    dispatch(updateProductInStore({ id, updatedProduct }));
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
    { field: "id", headerName: "ID", width: 90 },
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
        rows={rows.map((row) => ({ ...row, id: row.id || Math.random() }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        editMode="row"
        processRowUpdate={processRowUpdate}
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default ProductDataGrid;
