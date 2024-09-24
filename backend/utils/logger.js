const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/error.log');

const logger = (error) => {
  // Loguear el error en un archivo
  fs.appendFile(logFilePath, `${new Date().toISOString()} - ${error.stack}\n`, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo de registro:', err);
    }
  });
};

module.exports = logger;
