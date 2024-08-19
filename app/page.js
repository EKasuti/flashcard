'use client'
import getStipe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography, Container, Box, Grid } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (!isSignedIn) {
      alert("You can only generate cards if you are logged in. Redirecting to login page...");
      router.push('/sign-in');
    } else {
      router.push('/generate');
    }
  }

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'https://smartflash-rust.vercel.app/'
      }
    })

    const checkoutSessionJson = await checkoutSession.json()
    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStipe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="100vh" disableGutters>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      {/* NAVBAR */}
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <Toolbar>
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <Typography variant="h6" style={{ flexGrow: 1, color: 'black' }}>SmartFlash </Typography>
          <SignedOut>
           
            <Button variant="contained" href="/sign-up" sx={{ mt: 2, mr:2, mb:2, backgroundColor: 'gray', '&:hover': { backgroundColor: 'darkblue' } }}>Sign Up</Button>
            <Button variant="contained" href="/sign-in" sx={{ mt: 2, mb:2, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' } }}>Login</Button>
          </SignedOut>

          {/* If signed in */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          textAlign: 'center',
          my: 4,
        }}
      >

        <Typography variant="h3" gutterBottom> Unlock the power of Smart Learning with SmartFlash</Typography>
        <Typography variant="h6" gutterBottom> Welcome to FlashLearn, the ultimate platform to enhance your memory and learning efficiency.
          Whether you&apos;re studying for exams, mastering a new language, or simply looking to boost your knowledge,
          FlashLearn offers a seamless and engaging flashcard experience designed to fit your needs
        </Typography>

        <Typography variant="h6" gutterBottom>Start your journey today and discover how easy and fun learning can be!</Typography>

        <Button variant="contained" sx={{ mt: 2, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' } }} onClick={handleGetStarted}> Get Started</Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom> Features</Typography>

        <Grid container spacing={4}>
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Custom Flashcard Creation</Typography>
              <Typography>Design your own flashcards with ease, tailored to your unique learning style</Typography>
            </Box>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Multi-Language Support</Typography>
              <Typography>Create and study flashcards in multiple languages, perfect for language learners and international students</Typography>
            </Box>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Smart Deck Recommendations</Typography>
              <Typography>Receive personalized flashcard deck suggestions based on your learning preferences and goals, helping you stay on track and discover new topics</Typography>
            </Box>
          </Grid>

          {/* Feature 4 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Group Study Sessions</Typography>
              <Typography>Join or create virtual study groups to collaborate with others in real-time, making learning more social and interactive</Typography>
            </Box>
          </Grid>

          {/* Feature 5 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Achievement Badges</Typography>
              <Typography>Earn badges and rewards as you progress through your learning journey, motivating you to reach new milestones</Typography>
            </Box>
          </Grid>

          {/* Feature 6 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Automated Reminders</Typography>
              <Typography>Never miss a study session with customizable reminders and notifications that keep you on track with your learning schedule</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* PRICING */}
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom> Pricing</Typography>
        <Typography variant="h5" gutterBottom>Choose the Plan That Fits You Best</Typography>
        <Grid container spacing={4}>
          {/* Pricing 1: Free Plan */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Free Plan</Typography>
              <Typography variant="h6" gutterBottom>$0 / Month</Typography>
              <Typography gutterBottom>Access to basic features</Typography>
              <Typography gutterBottom>Create up to 50 flashcards</Typography>
              <Typography gutterBottom>Limited to 2 shared decks</Typography>
              <Typography gutterBottom>Basic study modes</Typography>
              <Button variant="contained" sx={{ mt: 2, backgroundColor: 'gray', '&:hover': { backgroundColor: 'darkblue' } }}>Current Plan</Button>
            </Box>
          </Grid>

          {/* Pricing 2 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Premium Plan</Typography>
              <Typography variant="h6" gutterBottom>$10 / Month</Typography>
              <Typography gutterBottom>Everything in the Free Plan</Typography>
              <Typography gutterBottom>Early access to new features</Typography>
              <Typography gutterBottom>Create unlimited flashcards</Typography>
              <Typography gutterBottom>Priority Support</Typography>
              <Button variant="contained" sx={{ mt: 2, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' } }} onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Box>
          </Grid>

         
        </Grid>
      </Box>
    </Container>
  );
}