import { SignIn, SignUp } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Image from "next/image";

export default function SignUpPage(){
    return (
        <Container maxWidth="100vw" disableGutters>
            <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <Toolbar>
                    <Image src="/logo.png" alt="Logo" width={50} height={50} />
                    <Typography variant="h6" style={{ flexGrow: 1, color: 'black' }}>SmartFlash </Typography>
                 
                    <Button variant="contained" href="/sign-up" sx={{ mt: 2, mr:2, mb:2, backgroundColor: 'gray', '&:hover': { backgroundColor: 'darkblue' } }}>Sign Up</Button>
                    <Button variant="contained" href="/sign-in" sx={{ mt: 2, mb:2, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' } }}>Login</Button>
                </Toolbar>
            </AppBar>

            <Box 
                display={"flex"}
                flexDirection={"column"}
                alignItems="center"
                justifyContent="center"
                sx={{my:8}}
            >
                <SignUp/>

            </Box>
        </Container>
    )
}