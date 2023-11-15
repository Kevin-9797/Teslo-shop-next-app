import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Link,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { CartContext, UIContext } from "@/context";
import {useState} from 'react';

export const AdminNavbar = () => {

  const { sidemenuOpen, toggleSidemenu } = useContext(UIContext);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/category/men" passHref legacyBehavior>
          <Link display={"flex"} alignItems={"center"}>
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop </Typography>
          </Link>
        </NextLink>
        <Box flex={1}></Box>
       
        <Box flex={1}></Box>
        

     
       
          <Button onClick={ () => toggleSidemenu()}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
