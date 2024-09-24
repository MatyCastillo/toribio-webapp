import React, { useState, useEffect } from "react";
import { Box, Grid, Paper } from "@mui/material";
import NumericKeyboard from "./NumericKeyboard";
import PaymentButtons from "./PaymentButtons";
import PaymentTable from "./PaymentTable";
import SmallInfoBox from "./SmallInfoBox";
import { SnackbarProvider, useSnackbar } from "notistack";
import {
  fetchPricesByDate,
  sendPaymentInfo,
  deletePaymentById,
} from "../services/index";
import Header from "./Header";
import ConfirmDialog from "./ConfirmDialog";
import moment from "moment-timezone";

const MainPage = () => {
  const [amount, setAmount] = useState("");
  const [payments, setPayments] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [dateZ, setDateZ] = useState(new Date());
  const date = moment(dateZ)
    .tz("America/Argentina/Buenos_Aires")
    .format("YYYY-MM-DD");
  const [totals, setTotals] = useState([
    { title: "Efectivo", total: "$0", color: "#2196f3" },
    { title: "QR", total: "$0", color: "#4caf50" },
    { title: "Transf.", total: "$0", color: "#ff9800" },
    { title: "Tarjeta", total: "$0", color: "#e91e63" },
    { title: "Diferencia", total: "$0", color: "#9c27b0" },
  ]);
  const branch = sessionStorage.getItem("branch");
  const user = sessionStorage.getItem("user");

  const handleValueChange = (value) => {
    setAmount(value);
  };

  const handlePayment = async (method) => {
    try {
      const response = await sendPaymentInfo(method, amount, branch, user);
      console.log("response", response);
      await updatePaymentsByDate(date); // Update payments list
      if (response.status === 201) {
        enqueueSnackbar("Pago registrado", {
          autoHideDuration: 500,
          variant: "success",
        });
        setAmount(""); // Clear numeric keyboard area
      } else {
        enqueueSnackbar("Error al registrar el pago", {
          autoHideDuration: 800,
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar("Ocurrió un error, intente nuevamente", {
        variant: "error",
      });
      console.error("Error:", err);
    }
  };

  const updatePaymentsByDate = async (date) => {
    try {
      const response = await fetchPricesByDate(date, branch);
      setPayments(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    updatePaymentsByDate(date);
  }, [date]);

  const handleDeletePayment = async (paymentId) => {
    try {
      await deletePaymentById(paymentId);
      await updatePaymentsByDate(date); // Refresh payments list
      enqueueSnackbar("Pago eliminado", {
        autoHideDuration: 800,
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Error al eliminar el pago", { variant: "error" });
      console.error("Error deleting payment:", error);
    }
  };

  const openDeleteDialog = (payment) => {
    setPaymentToDelete(payment);
    setOpenConfirmDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenConfirmDialog(false);
    setPaymentToDelete(null);
  };

  const calculateTotals = (payments) => {
    const totals = {
      Efectivo: 0,
      QR: 0,
      Transf: 0,
      Tarjeta: 0,
      Diferencia: 0,
    };

    payments.forEach((payment) => {
      switch (payment.method.toLowerCase()) {
        case "efectivo":
          totals.Efectivo += parseFloat(payment.amount);
          break;
        case "qr":
          totals.QR += parseFloat(payment.amount);
          break;
        case "transferencia":
          totals.Transf += parseFloat(payment.amount);
          break;
        case "tarjeta":
          totals.Tarjeta += parseFloat(payment.amount);
          break;
        case "diferencia":
          totals.Diferencia += parseFloat(payment.amount);
          break;
        default:
          break;
      }
    });

    const formattedTotals = [
      {
        title: "Efectivo",
        total: `${totals.Efectivo.toFixed(2)}`,
        color: "#2196f3",
      },
      { title: "QR", total: `${totals.QR.toFixed(2)}`, color: "#4caf50" },
      {
        title: "Transf.",
        total: `${totals.Transf.toFixed(2)}`,
        color: "#ff9800",
      },
      {
        title: "Tarjeta",
        total: `${totals.Tarjeta.toFixed(2)}`,
        color: "#e91e63",
      },
      {
        title: "Diferencia",
        total: `${totals.Diferencia.toFixed(2)}`,
        color: "#9c27b0",
      }, // Calcula la diferencia aquí si es necesario
    ];

    setTotals(formattedTotals);
  };

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={1000}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          bgcolor: "primary.main",
          height: "85vh",
          overflow: "hidden",
          flexGrow: 1,
        }}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: 2,
            pt: 0,
            boxSizing: "border-box",
            // overflow: "hidden",
          }}
        >
          <Grid
            container
            spacing={3}
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            sx={{ pt: 3, pr: 3 }}
          >
            <Grid item xs={4}>
              <Header />
            </Grid>
            {totals.map((item, index) => (
              <Grid item xs={1} key={index}>
                <SmallInfoBox
                  title={item.title}
                  total={item.total}
                  color={item.color}
                />
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            spacing={2}
            alignItems="stretch"
            justifyContent="center"
            sx={{ height: "100%" }}
          >
            <Grid
              item
              xs="auto"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <NumericKeyboard
                onValueChange={handleValueChange}
                currentValue={amount}
              />
            </Grid>

            <Grid
              item
              xs="auto"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <PaymentButtons onPayment={handlePayment} amount={amount} />
            </Grid>

            <Grid
              item
              xs="auto"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <PaymentTable payments={payments} onDelete={openDeleteDialog} />
            </Grid>
          </Grid>
          <ConfirmDialog
            open={openConfirmDialog}
            close={closeDeleteDialog}
            title="Confirmar eliminación"
            description={`¿Estás seguro de que deseas eliminar el pago de $${
              paymentToDelete?.amount
            } con método ${paymentToDelete?.method.toUpperCase()}?`}
            actionButton="Eliminar"
            actionButtonColor="error"
            func={() => {
              if (paymentToDelete) {
                handleDeletePayment(paymentToDelete.id);
                closeDeleteDialog();
              }
            }}
          />
        </Paper>
      </Box>
    </SnackbarProvider>
  );
};

export default MainPage;
