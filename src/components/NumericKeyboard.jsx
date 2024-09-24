import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, InputAdornment, Box } from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const NumericKeyboard = ({ onValueChange, currentValue }) => {
  const [rawValue, setRawValue] = useState(currentValue);

  useEffect(() => {
    setRawValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= "0" && event.key <= "9" && rawValue.length < 10) {
        const newValue = rawValue + event.key;
        setRawValue(newValue);
        onValueChange(newValue);
      } else if (event.key === "Backspace") {
        const newValue = rawValue.slice(0, -1);
        setRawValue(newValue);
        onValueChange(newValue);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [rawValue, onValueChange]);

  const handleButtonClick = (value) => {
    if (rawValue.length < 10 && /^[0-9]*$/.test(rawValue + value)) {
      const newValue = rawValue + value;
      setRawValue(newValue);
      onValueChange(newValue);
    }
  };

  const handleDelete = () => {
    const newValue = rawValue.slice(0, -1);
    setRawValue(newValue);
    onValueChange(newValue);
  };

  const handleClear = () => {
    setRawValue("");
    onValueChange("");
  };

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const buttons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", ","];

  return (
    <Box
      sx={{
        padding: 2,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "300px",
        vw: "1vw",
        maxHeight: "600px",
      }}
    >
      <TextField
        variant="outlined"
        fullWidth
        value={formatNumber(rawValue)}
        InputProps={{
          readOnly: true,
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          style: { textAlign: "right" },
        }}
        inputProps={{
          maxLength: 10,
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        sx={{ marginBottom: 1, fontSize: "24px" }}
      />
      <Grid container spacing={1} sx={{ flex: 1, justifyContent: "center" }}>
        {buttons.map((button) => (
          <Grid item xs={4} key={button}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                height: "100%",
                margin: 0.5,
                backgroundColor: "black",
                color: "white",
                fontSize: "24px",
                "&:focus": {
                  backgroundColor: "black",
                },
                "&:active": {
                  backgroundColor: "black",
                },
              }}
              onClick={() => handleButtonClick(button)}
            >
              {button}
            </Button>
          </Grid>
        ))}
        <Grid item xs={4}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              height: "100%",
              margin: 0.5,
              backgroundColor: "gray",
              color: "white",
              fontSize: "24px",
              "&:focus": {
                backgroundColor: "gray",
              },
              "&:active": {
                backgroundColor: "gray",
              },
            }}
            onClick={handleClear}
          >
            <DeleteForeverIcon />
          </Button>
        </Grid>
        <Grid item xs={8}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              height: "100%",
              margin: 0.5,
              backgroundColor: "red",
              color: "white",
              fontSize: "24px",
              "&:focus": {
                backgroundColor: "red",
              },
              "&:active": {
                backgroundColor: "red",
              },
            }}
            onClick={handleDelete}
            startIcon={<BackspaceIcon />}
          >
            Borrar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NumericKeyboard;
