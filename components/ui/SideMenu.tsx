import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  DashboardOutlined,
  EscalatorWarningOutlined,
  FemaleOutlined,
  LoginOutlined,
  MaleOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { AuthContext, UIContext } from "@/context";
import { useRouter } from "next/router";

export const SideMenu = () => {
  const { sidemenuOpen, toggleSidemenu } = useContext(UIContext);
  const { isLoggedIn, user,logout } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const navigateTo = (url: string) => {
    toggleSidemenu();
    router.push(url);
  };
  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;

    navigateTo(`/search/${searchTerm}`);
  };
  // useEffect(() => {
  //   toggleSidemenu()

  // }, [sidemenuOpen])


  return (
    <Drawer
      open={sidemenuOpen}
      anchor="right"
      onClose={() => toggleSidemenu()}
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              autoFocus
              type="text"
              placeholder="Buscar..."
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && onSearchTerm()}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => onSearchTerm()}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>
          {isLoggedIn && (
            <>
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Perfil"} />
              </ListItem>

              <ListItem button onClick={ () => navigateTo('/orders/history')}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"My Orders"} />
              </ListItem>
            </>
          )}

          <ListItem
            button
            sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo("/category/men")}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Mens"} />
          </ListItem>

          <ListItem
            button
            sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo("/category/women")}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Womens"} />
          </ListItem>

          <ListItem
            button
            sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo("/category/kid")}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={"Kids"} />
          </ListItem>

          {isLoggedIn ? (
            <ListItem button onClick={logout}>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={"Salir"} />
            </ListItem>
          ) : (
            <ListItem button onClick={ () =>  navigateTo(`/auth/login?p=${ router.asPath }`) }>
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={"Ingresar"} />
            </ListItem>
          )}

          {isLoggedIn && user?.role === "admin" ? (
            <Box>
              <Divider />
              <ListSubheader>Admin Panel</ListSubheader>

              <ListItem button onClick={ ( ) => navigateTo('/admin')}>
                <ListItemIcon>
                  <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItem>
              <ListItem button onClick={ ( ) => navigateTo('/admin/products')}>
                <ListItemIcon>
                  <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary={"Products"} />
              </ListItem>
              <ListItem button onClick={ ( ) => navigateTo('/admin/orders')}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Orders"} />
              </ListItem>

              <ListItem button onClick={ ( ) => navigateTo('/admin/users') } >
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={"Users"} />
              </ListItem>
            </Box>
          ) : (
            <></>
          )}
        </List>
      </Box>
    </Drawer>
  );
};
