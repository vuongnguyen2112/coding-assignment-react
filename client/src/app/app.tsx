import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import TicketList from '../components/TicketList';
import TicketDetails from '../components/TicketDetails';
import TicketForm from '../components/TicketForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<TicketList />} />
        <Route path="/add" element={<TicketForm />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
