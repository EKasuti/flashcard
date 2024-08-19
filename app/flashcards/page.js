'use client'

import { SignedIn, UserButton, useUser } from "@clerk/nextjs"
import { Card, CardActionArea, CardContent, Container, Grid, Typography, Box, TextField, Fab, AppBar, Toolbar} from "@mui/material"
import { Add as AddIcon } from '@mui/icons-material'
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { useEffect, useState } from 'react'
import { db } from "@/firebase"
import { useRouter } from 'next/navigation'
import Image from "next/image"

function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [filteredFlashcards, setFilteredFlashcards] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        async function getFlashcards(){
            if(!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()){
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
                setFilteredFlashcards(collections) // Initialize filtered flashcards
            } else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    }, [user])

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredFlashcards(flashcards)
        } else {
            const filtered = flashcards.filter(flashcard => 
                flashcard.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredFlashcards(filtered)
        }
    }, [searchTerm, flashcards])

    if (!isLoaded || !isSignedIn || !isClient){
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    const handleAddFlashcard = () => {
        router.push('/generate')
    }

    return(
        <Container maxWidth="100vh" disableGutters >
            <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', mb:4}}>
                <Toolbar>
                    <Image src="/logo.png" alt="Logo" width={50} height={50} />
                    <Typography variant="h6" style={{ flexGrow: 1, color: 'black' }}>SmartFlash</Typography>

                    {/* If signed in */}
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom>My Flashcards</Typography>
                <Typography variant="subtitle1">Click on a flashcard to view details</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <TextField 
                    label="Search Flashcards" 
                    variant="outlined" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    sx={{ mr: 2, width: '300px' }}
                />
            </Box>
            <Grid container spacing={3} sx={{px:4}}>
                {filteredFlashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ 
                            transition: 'transform 0.3s, box-shadow 0.3s', 
                            '&:hover': { 
                                transform: 'scale(1.05)', 
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3)' 
                            } 
                        }}>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h6" >{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Fab
                color="primary" 
                aria-label="add" 
                sx={{ position: 'fixed', bottom: 20, right: 20, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' } }} 
                onClick={handleAddFlashcard}
            
            >
                <AddIcon/>
                
            </Fab>
        </Container>
    )
}

export default Flashcards