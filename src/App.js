import {useEffect, useRef, useState} from "react";
import {VStack,Box,Container,Button, Input, HStack} from "@chakra-ui/react";
import {onAuthStateChanged,getAuth,GoogleAuthProvider, signInWithPopup,signOut} from "firebase/auth"
import Message from "./Components/Message";
import {app} from "./firebase";
import {getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy} from "firebase/firestore";



const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const googleProvider = new GoogleAuthProvider();
  signInWithPopup(auth, googleProvider);
}

const logoutHandler = () => signOut(auth);




function App() {

  const [user,setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  
  const divForScroll = useRef(null);


  const submitHandler = async (e) => {
    e.preventDefault();
  

    setMessage("");
    try {
      await addDoc(collection(db,"messages"),{
        text:message,
        uri:user.photoURL,
        uid:user.uid,
        createdAt:serverTimestamp(),
      })
      divForScroll.current.scrollIntoView({behavior:"smooth"})
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    const unsubscribed = onAuthStateChanged(auth,(data)=>{
      setUser(data);
    })


    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribedForMessages = onSnapshot(q, (snap)=>{
      setMessages(snap.docs.map(item => ( {
          id: item.id,
          ...item.data(), 
        })
      )
    )
    }
    );
 
    return ()=>{
      unsubscribed();
      unsubscribedForMessages();
    }
  },[])

  return (
    <Box bg={"white"}>
     {user?( <Container bg={"white"} h={"100vh"}>
        <VStack h={"full"} paddingY={2}>
          <Button onClick={logoutHandler} w={"full"} colorScheme={"purple"}>Logout</Button>
         <VStack bg={"purple.100"} h={"full"} w={"full"} overflowY={"auto"} css={{"&::-webkit-scrollbar":{
          display:"none",
         }}}>
         {
          messages.map(item => (
            <Message 
            key = {item.id}
            text = {item.text} 
            uri = {item.uri} 
            user = {item.uid === user.uid?"me":"other"}/>
          ))
         }
         <div ref = {divForScroll}></div>

        </VStack>

        <form style={{
          width: "100%",
        }}>
          <HStack>
            <Input value = {message} onChange={(e)=>setMessage(e.target.value)} placeholder="Enter a message" focusBorderColor="green"/>
            <Button onClick={submitHandler} type="submit" colorScheme="whatsapp">Send</Button>
          </HStack>
        </form>

       
        </VStack>
      </Container>):(<VStack justifyContent={"center"} h={"100vh"} w={"full"} bg={"purple.100"}>
          <Button onClick={loginHandler} colorScheme={"whatsapp"}>
            SignInWithGoogle
          </Button>
      </VStack>)
      }


    </Box>
  );
}

export default App;
