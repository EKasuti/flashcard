'use client'

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { db } from "@/firebase"
import { AppBar, Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material"
import { writeBatch, doc, collection, getDoc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"


function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        return null
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res) => res.json())
        .then((data) => {
            setFlashcards(data)
            setIsLoading(false)
        })
        .catch(() => {
            setIsLoading(false)
        })
    }

    const handleCardClick = (id) =>{
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose =() => {
        setOpen(false)
    }
    const saveFlashcards = async () =>{
        if(!name){
            alert("Please enter a name")
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)){
                alert("Flashcard collection with the same name already exists.")
                return
            } else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge:true})
            }
        } else{
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) =>{
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }
    const navigateToFlashcards = () => {
        router.push('/flashcards')
    }

    return (
        <Container maxWidth="100vw" disableGutters>
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
            <Box sx={{
                mt:4, mb:6, display: 'flex', flexDirection: 'column', alignItems:'center', textAlign: 'center'
            }}>
                <Typography variant="h4" gutterBottom  sx={{mt:4}}>Generate Flashcards</Typography>
                <Typography variant="subtitle1" gutterBottom >Enter the text below to generate your flashcards</Typography>
                <Paper sx={{p:4, width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems:'center'}}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label= "Enter text to generate flashcards"
                        fullWidth
                        multiline
                        rows={8}
                        variant="outlined"
                        sx={{mb:2}}
                    />
                    <Button 
                        variant="contained" 
                        sx={{ mt: 2, mb:2, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' }, width: '300px' }} 
                        onClick={handleSubmit} 
                        disabled={!text.trim() || isLoading}
                    >
                        {isLoading ? 'Generating...' : 'Generate Flashcards'}
                    </Button>


                </Paper>
            </Box>


            {flashcards.length > 0 && (
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="h5" sx={{ my: 4, mb: 4 }}>Flashcards Preview</Typography>
                    <Typography variant="subtitle2" sx={{ mb: 4 }}>You have {flashcards.length} flashcards</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ 
                                    transition: 'transform 0.3s, box-shadow 0.3s', 
                                    '&:hover': { 
                                        transform: 'scale(1.05)', 
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)' 
                                    } 
                                }}>
                                    <CardActionArea onClick={() => { handleCardClick(index) }}>
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
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
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
                                                    boxSizing: 'border-box'
                                                },
                                                '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)'
                                                },
                                            }}>
                                                <div>
                                                    <div>
                                                        <Typography variant="h6" component="div">
                                                           <strong>Question:</strong> <br/> {flashcard.front}
                                                        </Typography>
                                                    </div>

                                                    <div>
                                                        <Typography variant="h6" component="div">
                                                           <strong>Answer:</strong> <br/> {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{mt:4, display:"flex", justifyContent:'center'}}>
                        <Button variant="contained" sx={{ mt: 2, mb:2, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' }, width: '300px' }} onClick={handleOpen}> Save this collection</Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{textAlign: 'center', fontWeight: 'bold'}}>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variance="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}> Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>

            <Button 
                color="primary" 
                aria-label="navigate" 
                sx={{ position: 'fixed', bottom: 16, right: 16, backgroundColor: 'darkblue', '&:hover': { backgroundColor: 'darkblue' }, color: 'white'}} 
                onClick={navigateToFlashcards}
            >
                Flashcards
            </Button>
        </Container>
    )
}
export default Generate