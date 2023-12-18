
import React from "react";
import {Avatar, HStack, Text} from "@chakra-ui/react";

const Message = ({text, uri, user="other"})=>{
    return (
        <HStack alignSelf={user === "me"?"flex-end":"flex-start"} borderRadius={"lg"} bg={"gray.100"} m={"2"} paddingX={"2"} paddingY={"2"}>
            {
                user === "other" && <Avatar src = {uri} size='sm'/>
            }
            <Text>{text}</Text>
            {
                user === "me" && <Avatar src={uri} size='sm'/>
            }
            
        </HStack>
    )
}

export default Message;

