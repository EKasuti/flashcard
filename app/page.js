'use client'
import getStipe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography, Container, Box, Grid } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LanguageIcon from '@mui/icons-material/Language';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AlarmIcon from '@mui/icons-material/Alarm';

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
        origin: 'http://localhost:3000'
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
    <Container maxWidth={false} disableGutters>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      {/* NAVBAR */}
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'}}>
        <Toolbar>
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <Typography variant="h6" style={{ flexGrow: 1, color: 'black' }}>SmartFlash</Typography>
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

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",ml:{ xs:2, sm: 6}, mr:{ xs:2, sm: 6}, my:{ xs:2, sm: 10}, flexDirection: {xs: "column", sm: 'row'}}}>
        <Box sx={{ textAlign: { xs: 'center', sm: 'start' }, flex: 1, my:4 }}>
          <Typography variant="h4" gutterBottom> Unlock the power of Smart Learning with SmartFlash</Typography>
          <Typography variant="h6" gutterBottom> Welcome to FlashLearn, the ultimate platform to enhance your memory and learning efficiency.
            Whether you&apos;re studying for exams, mastering a new language, or simply looking to boost your knowledge,
            FlashLearn offers a seamless and engaging flashcard experience designed to fit your needs
          </Typography>
          <Typography variant="h6" gutterBottom>Start your journey today and discover how easy and fun learning can be!</Typography>
          <Button variant="contained" sx={{ mt: 2, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' } }} onClick={handleGetStarted}> Get Started</Button>
        </Box>

        <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Image src="/landing_page.png" alt="Landing page" width={400} height={400} style={{ maxWidth: { xs: '100px', sm: '200px', md: '400px' }, height: 'auto'}} />
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 12, textAlign: 'center', ml:{ xs:4, sm: 6}, mr:{ xs:4, sm: 6}, my:{ xs:2, sm: 10} }}>
        <Typography variant="h4" gutterBottom> Features</Typography>

        <Grid container spacing={4}>
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
              <Box>
                <FlashOnIcon sx={{ mr: 1, color: 'darkblue' }} />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold'}}>Custom Flashcard Creation</Typography>
              <Typography>Design your own flashcards with ease, tailored to your unique learning style</Typography>
            </Box>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
              <Box>
                  <LanguageIcon sx={{ mr: 1, color: 'darkblue' }} />
              </Box>
              <Typography variant="h6"  gutterBottom sx={{ fontWeight: 'bold'}}>Multi-Language Support</Typography>
              <Typography>Create and study flashcards in multiple languages, perfect for language learners and international students</Typography>
            </Box>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
              <Box>
                <AutoAwesomeIcon sx={{ mr: 1, color: 'darkblue' }} />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold'}}>Smart Deck Recommendations</Typography>
              <Typography>Receive personalized flashcard deck suggestions based on your learning preferences and goals, helping you stay on track and discover new topics</Typography>
            </Box>
          </Grid>

          {/* Feature 4 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
              <Box>
                <GroupIcon sx={{ mr: 1, color: 'darkblue' }} />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold'}}>Group Study Sessions</Typography>
              <Typography>Join or create virtual study groups to collaborate with others in real-time, making learning more social and interactive</Typography>
            </Box>
          </Grid>

          {/* Feature 5 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
              <Box>
                <EmojiEventsIcon sx={{ mr: 1, color: 'darkblue' }} />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold'}}>Achievement Badges</Typography>
              <Typography>Earn badges and rewards as you progress through your learning journey, motivating you to reach new milestones</Typography>
            </Box>
          </Grid>

          {/* Feature 6 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
              <Box>
                <AlarmIcon sx={{ mr: 1, color: 'darkblue' }} />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold'}}>Automated Reminders</Typography>
              <Typography>Never miss a study session with customizable reminders and notifications that keep you on track with your learning schedule</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* PRICING */}
      <Box sx={{ my: 4, textAlign: 'center', ml: {xs:8, sm:12}, mr: { xs:8, sm:12} }}>
        <Typography variant="h4" gutterBottom> Pricing</Typography>
        <Typography variant="h5" gutterBottom sx={{color: "darkblue",}}>Choose the Plan That Fits You Best</Typography>
        <Grid container spacing={4} sx={{ my:1}}>
          
          {/* Pricing 1: Free Plan */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
              <Typography variant="h5" gutterBottom>Free Plan</Typography>
              <Typography variant="h6" gutterBottom>$0 / Month</Typography>
              <Typography gutterBottom>Access to basic features</Typography>
              <Typography gutterBottom>Create up to 50 flashcards</Typography>
              <Typography gutterBottom>Limited to 2 shared decks</Typography>
              <Typography gutterBottom>Basic study modes</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2, mr:2, mb:2, backgroundColor: 'gray', '&:hover': { backgroundColor: 'darkblue' } }}>Current Plan</Button>
            </Box>
          </Grid>

          {/* Pricing 2 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
              <Typography variant="h5" gutterBottom>Standard Plan</Typography>
              <Typography variant="h6" gutterBottom>$10 / Month</Typography>
              <Typography gutterBottom>Everything in the Free Plan</Typography>
              <Typography gutterBottom>Create unlimited flashcards</Typography>
              <Typography gutterBottom>Advanced study modes</Typography>
              <Typography gutterBottom>Priority Support</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2, mr:2, mb:2, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' } }} onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Box sx={{ mt: 4 }}>
          <Box sx={{ borderTop: '1px solid lightgrey', pt: 2, ml:4, mr:4 }}>
            <Typography variant="body1">© {new Date().getFullYear()} SmartFlash. All rights reserved.</Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}