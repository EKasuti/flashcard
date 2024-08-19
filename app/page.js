'use client'
import getStipe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, userButton, useUser } from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography, Container, Box, TablePagination, Grid } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";



export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted=()=>{
    if (!isSignedIn){
      alert("You can only generate cards if you are logged in. Redirecting to login page...");
      router.push('/sign-in');
    } else{
      router.push('/generate');
    }
  }
  const handleSubmit = async ()=>{
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers:{
        origin: 'http://localhost:3000'
      }
    })

    const checkoutSessionJson = await checkoutSession.json()
    if( checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStipe()
    const {error} = await stripe.redirectToCheckout({
    sessionId: checkoutSessionJson.id,
    })

    if (error){
      console.warn(error.message)
    }

  }
    return (
      <Container maxWidth="100vw">
        <Head>
          <title>Flashcard SaaS</title>
          <meta name = "description" content="Create flashcard from your text"/>
        </Head>

        {/* NAVBAR */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{flexGrow:1}}>SmartFlash </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">Login</Button>
              <Button color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>

            {/* If signed in */}
            <SignedIn>
              <UserButton/>
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            textAlign: 'center',
            my:4,
          }}
        >

          <Typography variant="h3" gutterBottom> Unlock the power of Smart Learning with SmartFlash</Typography>
          <Typography variant="h6" gutterBottom> Welcome to FlashLearn, the ultimate platform to enhance your memory and learning efficiency. 
            Whether you're studying for exams, mastering a new language, or simply looking to boost your knowledge, 
            FlashLearn offers a seamless and engaging flashcard experience designed to fit your needs
            </Typography>

            <Typography variant="h6" gutterBottom>Start your journey today and discover how easy and fun learning can be!</Typography>

          <Button variant="contained" color="primary" sx={{mt:2}} onClick={handleGetStarted}> Get Started</Button>
        </Box>

        {/* Features Section */}
        <Box sx={{my:6, textAlign: 'center'}}>
          <Typography variant="h4" gutterBottom> Features</Typography>
          
          <Grid container spacing={4}>
            {/* Feature 1 */}
            <Grid item xs={12} md={4}>
              <Box sx={{p:3, border: '1px solid', borderColor:'grey.300', borderRadius:2}}>
                <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
                <Typography>Simply input your text and let our software do the rest</Typography>
              </Box>
            </Grid>
            
            {/* Feature 2 */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
              <Typography>Simply input your text and let our software do the rest</Typography>
            </Grid>
            
            {/* Feature 3 */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
              <Typography>Simply input your text and let our software do the rest</Typography>
            </Grid>
          
          </Grid>
        </Box>

        {/* PRICING */}
        <Box sx={{my:6, textAlign:'center'}}>
          <Typography variant="h4" gutterBottom> Pricing</Typography>
          <Grid container spacing={4}>
            {/* Pricing 1 */}
            <Grid item xs={12} md={6}>
              <Box sx={{p:3, border: '1px solid', borderColor:'grey.300', borderRadius:2}}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5 / Month</Typography>
              <Typography gutterBottom>Access to basic flachcard features and limited storage</Typography>
              <Button variant="contained" color="primary" sx={{mt:2}}>Choose Basic</Button>
              </Box>
            </Grid>
            
             {/* Pricing 2 */}
             <Grid item xs={12} md={6}>
              <Box sx={{p:3, border: '1px solid', borderColor:'grey.300', borderRadius:2}}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$10 / Month</Typography>
              <Typography gutterBottom>Unlimited flashcard and storage, with priority support</Typography>
              <Button variant="contained" color="primary" sx={{mt:2}} onClick={handleSubmit}>
                Choose Pro
              </Button>
              </Box>
            </Grid>
            
           
          </Grid>
          

        </Box>


      </Container>
  );
}
