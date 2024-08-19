'use client'

import { SignedIn, UserButton, useUser } from "@clerk/nextjs"
import { AppBar, Box, Card, CardActionArea, CardContent, Container, Grid, Toolbar, Typography, Button, IconButton } from "@mui/material"
import { collection, doc, getDocs } from "firebase/firestore"
import { useEffect, useState } from 'react'
import { db } from "@/firebase"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function Flashcard(){
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState(false)
    const [collectionName, setCollectionName] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [status, setStatus] = useState([]) // Track the status of each flashcard
    const router = useRouter()

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard(){
            if(!search || !user) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach((doc)=>{
                flashcards.push({id: doc.id, ...doc.data()})
            })
            setFlashcards(flashcards)
            setCollectionName(search)
            setStatus(new Array(flashcards.length).fill('skipped')) // Initialize status as skipped
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = () =>{
        setFlipped(!flipped)
    }

    const handleNext = () => {
        setStatus((prevStatus) => {
            const newStatus = [...prevStatus]
            newStatus[currentIndex] = 'right'
            return newStatus
        })
        setFlipped(false)
        setCurrentIndex((prevIndex) => prevIndex + 1)
    }

    const handleSkip = () => {
        setFlipped(false)
        setCurrentIndex((prevIndex) => prevIndex + 1)
    }

    const handleWrong = () => {
        setStatus((prevStatus) => {
            const newStatus = [...prevStatus]
            newStatus[currentIndex] = 'wrong'
            return newStatus
        })
        setFlipped(false)
        setCurrentIndex((prevIndex) => prevIndex + 1)
    }

    const handleRedo = () => {
        setCurrentIndex(0)
        setStatus(new Array(flashcards.length).fill('skipped'))
        setFlipped(false)
    }

    const handlePrevSet = () => {
        // Logic to navigate to the previous set of flashcards
        // This can be implemented based on your application's routing and data structure
    }

    const handleNextSet = () => {
        // Logic to navigate to the next set of flashcards
        // This can be implemented based on your application's routing and data structure
    }

    const handleBack = () => {
        router.push('/flashcards')
    }

    if (!isLoaded || !isSignedIn){
        return <></>
    }

    return(
        <Container maxWidth="100vw" disableGutters>
            {/* Navbar */}
            <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'}}>
                <Toolbar>
                    
                    <Image src="/logo.png" alt="Logo" width={50} height={50} />
                    <Typography variant="h6" style={{ flexGrow: 1, color: 'black' }}>SmartFlash</Typography>

                    {/* If signed in */}
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>
            
            {/* Back arrow */}
            <Box sx={{px:4}}>
                <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="back">
                    <ArrowBackIcon />
                </IconButton>
            </Box>

            {/* Flashcards */}
            {flashcards.length > 0 && (
                <Box sx={{mt:4, textAlign: 'center'}}>
                    <Typography variant="h5" sx={{ my:5}}>{collectionName} Flashcards Preview</Typography>
                    {currentIndex < flashcards.length ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <Card sx={{ 
                                transition: 'transform 0.3s, box-shadow 0.3s', 
                                '&:hover': { 
                                    transform: 'scale(1.05)', 
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)' 
                                },
                                width: '50%',
                                height: '50%',
                                mb: 4
                            }}>
                                <CardActionArea onClick={handleCardClick}>
                                    <CardContent>
                                        <Box sx={{
                                            perspective: '1000px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                            },
                                            '& > div > div': {
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                                textAlign: 'center'
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)'
                                            },
                                        }}>
                                            <div>
                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcards[currentIndex].front}
                                                    </Typography>
                                                </div>

                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcards[currentIndex].back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
                                <Button variant="contained" color="error" onClick={handleWrong}>X</Button>
                                <Button variant="contained" color="primary" onClick={handleSkip}>Skip</Button>
                                <Button variant="contained" color="success" onClick={handleNext}>✓</Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center' }}>
                            <Grid container spacing={3} sx={{px:4}}>
                                {flashcards.map((flashcard, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card sx={{ 
                                            backgroundColor: status[index] === 'right' ? 'green' : status[index] === 'wrong' ? 'red' : 'white',
                                            transition: 'transform 0.3s, box-shadow 0.3s', 
                                            '&:hover': { 
                                                transform: 'scale(1.05)', 
                                                boxShadow: '0 8px 16px rgba(0,0,0,0.3)' 
                                            } 
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    {flashcard.front}
                                                </Typography>
                                                <Typography variant="body2" component="div">
                                                    {flashcard.back}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent:"center", gap: 40, mt: 2, px:4}}>
                                <Button variant="contained" onClick={handlePrevSet}  sx={{ mt: 2, mb:2, backgroundColor: 'gray', '&:hover': { backgroundColor: 'darkblue' }}}>Previous Set</Button>
                                <Button variant="contained" onClick={handleRedo} sx={{ mt: 2, mb:2, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' }}}>Redo</Button>
                                <Button variant="contained" onClick={handleNextSet} sx={{ mt: 2, mb:2, backgroundColor: 'gray', '&:hover': { backgroundColor: 'darkblue' }}}>Next Set</Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Container>
    )
}

export default Flashcard