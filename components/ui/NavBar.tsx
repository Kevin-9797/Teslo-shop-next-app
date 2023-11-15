import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Link,
  Button,
  Typography,
  Box,
  IconButton,
  Badge,
  InputAdornment,
  Input
} from "@mui/material";
import NextLink from "next/link";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { useRouter } from "next/router";
import { CartContext, UIContext } from "@/context";
import {useState} from 'react';
import { ClearOutlined } from "@mui/icons-material";

export const NavBar = () => {

  const { sidemenuOpen, toggleSidemenu } = useContext(UIContext);
  const { numberOfItems } = useContext( CartContext );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { push, pathname } = useRouter();
  console.log(pathname)
  const isActiveLink = ( link: string ): boolean => {
      return pathname === link ? true : false
  }
 
  const onSearchTerm = () =>{

    if( searchTerm.trim().length === 0) return;

    push(`/search/${ searchTerm }`);
  }
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
        <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none',sm: 'block'}}} className='fadeIn'>
          <NextLink href={"/category/men"} passHref legacyBehavior>
            <Link>
              <Button  color={  isActiveLink( '/category/men' ) ? 'primary' : 'info'}>Men´s</Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/women"} passHref legacyBehavior>
            <Link>
              <Button color={  isActiveLink( '/category/women' ) ? 'primary' : 'info'}>Womens</Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/kid"} passHref legacyBehavior>
            <Link>
              <Button color={  isActiveLink( '/category/kid' ) ? 'primary' : 'info'} >Kids</Button>
            </Link>
          </NextLink>
        </Box>
        <Box flex={1}></Box>
        

        {
          isSearchVisible ? (

            <Input
                  sx={{ display: { xs: 'none',sm: 'flex'}}} 
                  autoFocus
                  className="fadeIn"
                  type="text"
                  placeholder="Buscar..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && onSearchTerm()}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => setIsSearchVisible(false)}>
                        <ClearOutlined />
                      </IconButton>
                    </InputAdornment>
                  }
                  />

          ) : (
         <IconButton sx={{ display: { xs: 'none', sm: 'flex'}}} onClick={() => setIsSearchVisible(true)} className="fadeIn">
          <SearchOutlined />
        </IconButton> 
          )
        }
        <IconButton sx={{ display: { xs: 'flex', sm: 'none'}}} onClick={ () => toggleSidemenu()}>
          <SearchOutlined />
        </IconButton>
        <NextLink href={"/cart"} passHref legacyBehavior>
            <Link>
            <IconButton>
               <Badge badgeContent={ numberOfItems > 9 ? '+9': numberOfItems  } color="secondary">
                                <ShoppingCartOutlined />
                            </Badge>

            </IconButton>
              <Button>Cart</Button>
            </Link>
          </NextLink>
          <Button onClick={ () => toggleSidemenu()}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
