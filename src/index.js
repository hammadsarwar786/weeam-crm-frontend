import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import AuthLayout from "./layouts/auth";
import AdminLayout from "layouts/admin";
import UserLayout from "layouts/user";
import {
  ChakraProvider,
  ColorModeScript,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import { useDispatch } from "react-redux";
import { getApi } from "services/api";
import { setTree,setUsers } from "./redux/localSlice";

function App() {
  const token = localStorage.getItem("token") || null;
  const dispatch = useDispatch();
  const [appLoaded, setAppLoaded] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  useNavigate();

  const user2 = useSelector((state) => state.user.user);

  const getToken = () => {
    return localStorage.getItem("token") || null;
  };

  const fetchTree = async () => {
    setAppLoaded(false);
    const response = await getApi("api/user/tree");
    const data = response.data || null;
    dispatch(setTree(data));

    setTimeout(() => {
      setAppLoaded(true);
    }, 0);
  };

  
  const fetchUsers = async () => {
    setAppLoaded(false);
    const response = await getApi("api/user/");
    const data = response.data || null;
    dispatch(setUsers(data?.user));

    setTimeout(() => {
      setAppLoaded(true);
    }, 0);
  };

  useEffect(() => {
    if (getToken() && user2) {
      fetchTree();
      fetchUsers();
    } else if(!getToken()) {
      setAppLoaded(true); 
    }
  }, [user2]);

  if (appLoaded)
    return (
      <>
        <ToastContainer />
        <Routes>
          {token && user?.role ? (
            user?.role == "user" ? (
              <Route path="/*" element={<UserLayout />} />
            ) : user?.role === "superAdmin" ? (
              <Route path="/*" element={<AdminLayout />} />
            ) : (
              ""
            )
          ) : (
            <Route path="/*" element={<AuthLayout />} />
          )}
        </Routes>
      </>
    );
  else
    return (
      <>
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          width="100%"
          height={"100vh"}
        >
          <Spinner />
        </Flex>
      </>
    );
}

ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider theme={theme} cssVarsRoot="body">
      <React.StrictMode>
        <ThemeEditorProvider>
          <Router>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
          </Router>
        </ThemeEditorProvider>
      </React.StrictMode>
    </ChakraProvider>
  </Provider>,
  document.getElementById("root")
);
