import React from "react";
import { Button, Grid } from "@mui/material";
import MoneyIcon from "@mui/icons-material/Money";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useSnackbar } from "notistack";


const PaymentButtons = ({ onPayment, amount, date }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handlePayment = (method) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      enqueueSnackbar("Introduzca el monto válido", { variant: "error" });
    } else {
      onPayment(method);
    }
  };
  // const handlePayment = async (method) => {
  //   try {
  //     const response = await sendPaymentInfo(method, amount, branch);
  //     console.log('Response:', response);
  //   } catch (err) {
  //     console.error('Error:', err);
  //   }
  // };


  const buttonStyle = {
    height: "100%",
    borderColor: "#333", // Color del borde
    color: "#333", // Color del texto
    fontSize: "24px",
    borderWidth: 2,
    borderRadius: 3, // Borde redondeado
    background: "transparent", // Fondo transparente
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ height: "100%", maxWidth: "300px", maxHeight: "600px" }}
    >
      <Grid item xs={12} sx={{ height: "20%" }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{ ...buttonStyle, borderColor: "#2196f3", color: "#2196f3" }} // Azul
          onClick={() => handlePayment("efectivo")}
          startIcon={<MoneyIcon />}
        >
          Efectivo
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ height: "20%" }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{ ...buttonStyle, borderColor: "#4caf50", color: "#4caf50" }} // Verde
          onClick={() => handlePayment("qr")}
          startIcon={<QrCodeIcon />}
        >
          QR
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ height: "20%" }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{ ...buttonStyle, borderColor: "#ff9800", color: "#ff9800" }} // Naranja
          onClick={() => handlePayment("transferencia")}
          startIcon={<AccountBalanceIcon />}
        >
          Transferencia
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ height: "20%" }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{ ...buttonStyle, borderColor: "#e91e63", color: "#e91e63" }} // Rosa
          onClick={() => handlePayment("tarjeta")}
          startIcon={<CreditCardIcon />}
        >
          Tarjeta
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ height: "20%" }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{ ...buttonStyle, borderColor: "#9c27b0", color: "#9c27b0" }} // Morado
          onClick={() => handlePayment("diferencia")}
          startIcon={<HelpOutlineIcon />}
        >
          Diferencia
        </Button>
      </Grid>
    </Grid>
  );
};

export default PaymentButtons;
