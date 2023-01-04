import Catalog from "../../features/catalog/Catalog";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from "./Header";
import { createTheme, ThemeProvider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ServerErrors from "../errors/ServerErrors";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import LoadingCpmponent from "./LoadingComponent";
import CheckoutPage from "../cheсkout/CheckoutPage";
import { useAppDispatch } from "../store/configureStore"
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import Login from "../../features/account/Login";

import Register from "../../features/account/Register";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import Orders from "../../features/orders/Orders";

function App() {

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {

    }
  }, [dispatch])

  useEffect(() => {

    console.log('app')
    initApp().then(() => setLoading(false));


  }, [initApp])

  const [darkmode, setDarkMode] = useState<boolean>(false)
  const paletteType = darkmode ? 'dark' : 'light'

  const theme = createTheme({
    palette: {
      mode: paletteType
    },
  });

  const changeTheme = () => {
    setDarkMode(!darkmode)
  }

  if (loading) return <LoadingCpmponent message="Initialising app ..." />

  return (


    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" theme="colored" draggable />
      <CssBaseline />
      <Header checked={darkmode} changeTheme={changeTheme} />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ProductDetails />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/server-error" element={<ServerErrors />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/basket' element={<BasketPage />} />

          {/* <Route element={<ProtectedRoutes />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route> */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

        </Routes>

      </Container>

    </ThemeProvider>

  );
}

export default App;
