import React from 'react'
import "./Chat.css"
import Chatsidebar from "../../components/Chat/Chatsidebar/Chatsidebar"
import ChatRightbar from '../../components/Chat/ChatRightbar/ChatRightbar'



function Chat() {
  
  return (
    <div>
      <div className='chatsubcontainer'>
        <div className='chatsidebar'>
          <Chatsidebar />
        </div>
        <div className='chatrightbar'>
          <ChatRightbar />
        </div>
      </div>
    </div>

  )
}

export default Chat
