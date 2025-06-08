"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  AppBar,
  Toolbar,
  Typography,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

type Medicamento = {
  CodMedicamento: number;
  descripcionMed: string;
  presentacion: string;
  stock: number;
  precioVentaUni: number;
  marca: string;
  tipoMedic?: { descripcion: string };
};

export default function MedicamentosTable() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    descripcionMed: "",
    presentacion: "",
    stock: "",
    precioVentaUni: "",
    marca: "",
    CodTipoMed: "",
  });

  // Carga medicamentos al abrir
  useEffect(() => {
    fetch("/api/medicamento")
      .then((res) => res.json())
      .then(setMedicamentos);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setForm({
      descripcionMed: "",
      presentacion: "",
      stock: "",
      precioVentaUni: "",
      marca: "",
      CodTipoMed: "",
    });
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    // Debes validar CodTipoMed (debe existir en la tabla TipoMedic)
    await fetch("/api/medicamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descripcionMed: form.descripcionMed,
        presentacion: form.presentacion,
        stock: Number(form.stock),
        precioVentaUni: Number(form.precioVentaUni),
        marca: form.marca,
        CodTipoMed: Number(form.CodTipoMed),
        fechaFabricacion: new Date().toISOString(),
        fechaVencimiento: new Date(Date.now() + 31536000000).toISOString(), // +1 año
        precioVentaPres: Number(form.precioVentaUni) * 10,
        CodEspec: 1,
      }),
    });
    // Recarga tabla
    fetch("/api/medicamento")
      .then((res) => res.json())
      .then(setMedicamentos);
    handleClose();
  };

  return (
    <Paper sx={{ p: 3, m: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Medicamentos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Nuevo Medicamento
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Descripción</TableCell>
            <TableCell>Presentación</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Precio Unitario</TableCell>
            <TableCell>Marca</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medicamentos.map((med) => (
            <TableRow key={med.CodMedicamento}>
              <TableCell>{med.descripcionMed}</TableCell>
              <TableCell>{med.presentacion}</TableCell>
              <TableCell>{med.stock}</TableCell>
              <TableCell>{med.precioVentaUni}</TableCell>
              <TableCell>{med.marca}</TableCell>
              <TableCell>{med.tipoMedic?.descripcion}</TableCell>
              <TableCell>
                <IconButton color="primary" size="small">
                  <EditIcon />
                </IconButton>
                <IconButton color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal para crear */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nuevo Medicamento</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Descripción"
            name="descripcionMed"
            fullWidth
            value={form.descripcionMed}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Presentación"
            name="presentacion"
            fullWidth
            value={form.presentacion}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Stock"
            name="stock"
            type="number"
            fullWidth
            value={form.stock}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Precio Unitario"
            name="precioVentaUni"
            type="number"
            fullWidth
            value={form.precioVentaUni}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Marca"
            name="marca"
            fullWidth
            value={form.marca}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="ID Tipo Medicamento"
            name="CodTipoMed"
            type="number"
            fullWidth
            value={form.CodTipoMed}
            onChange={handleChange}
            helperText="Debe existir el tipo en la base de datos"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleCreate} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}