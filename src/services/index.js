import axios from "axios";
import fileDownload from "js-file-download";
import API from "../utils/const";
import { format } from "date-fns";
import moment from 'moment-timezone';
// const dia = format(new Date(), "dd-MM-yyyy_HH-mm");
const dia = new Date();
const formattedDate = moment(dia).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');



const loginService = async ({ nombre, password }) => {
  const data = {
    username: nombre,
    password: password,
  };
  try {
    const response = await axios.post(`${API.URI}/api/v1/auth/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Nueva función para enviar información de pago
const sendPaymentInfo = async (method, amount, branchId,user) => {
  const data = {
    method,
    amount,
    date: formattedDate,
    branchId,
    user
  };

  try {
    const response = await axios.post(`${API.URI}/api/v1/pagos`, data);
    return response;
  } catch (err) {
    console.error('Error:', err);
    return err;
  }
};

const fetchPricesByDate = async (date, branch) => {
  try {
    const response = await fetch(`${API.URI}/api/v1/pagos?date=${date}&branch=${branch}`);
    if (!response.ok) {
      throw new Error('Error fetching prices');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
};


const deletePaymentById = async (id) => {
  try {
    // Realiza una solicitud DELETE al endpoint correspondiente
    const response = await axios.delete(`${API.URI}/api/v1/pagos/${id}`);
    return response;
  } catch (error) {
    // Manejo de errores
    console.error("Error al eliminar el pago:", error);
    throw error; // Lanza el error para que pueda ser manejado por la función que lo llama
  }
};

 // Función para obtener las fechas de los pagos
 const fetchPaymentDates = async () => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/pagos/dates`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener fechas de pagos:', error);
    throw error;
  }
};

const downloadPaymentsByDate = async (date) => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/pagos/download/${date}`, {
      responseType: 'blob'
    });

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pagosFecha:${new Date(date).toLocaleDateString()}.xlsx`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error al descargar pagos:', error);
    throw error;
  }
};

// Verificar si el nombre de usuario es único
const checkUsernameUnique = async (username) => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/users/check-username?username=${username}`);
    return response.data.isUnique; // Se espera que el backend devuelva un objeto con una propiedad `isUnique`
  } catch (error) {
    throw new Error('Error al verificar el nombre de usuario');
  }
};

// Añadir empleado
const addEmployee = async (empleado) => {
  const employeeData = {
    username: empleado.username,
          name: empleado.nombre,
          surname: empleado.apellido,
          branch: empleado.sucursal,
          role: empleado.rol,
          password: empleado.contraseña
        };
  try {
    const response = await axios.post(`${API.URI}/api/v1/users`, employeeData);
    return response.data;
  } catch (error) {
    throw new Error('Error al añadir empleado');
  }
};
export {
  loginService,
  sendPaymentInfo,
  fetchPricesByDate,
  deletePaymentById,
  fetchPaymentDates,
  downloadPaymentsByDate,
  addEmployee,
  checkUsernameUnique
};
