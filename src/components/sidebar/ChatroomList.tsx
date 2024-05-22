import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface ChatroomListProps {
  chatrooms: { chatroomId: number; name: string; isRemovable: boolean }[]
  selectedChatroom: number | null
  handleChatroomClick: (chatroomId: number) => void
  deleteChatroom: (chatroomId: number) => void
}

const ChatroomList: React.FC<ChatroomListProps> = ({
  chatrooms,
  selectedChatroom,
  handleChatroomClick,
  deleteChatroom,
}) => {
  return (
    <List>
      {chatrooms.length > 0 ? (
        chatrooms.map((chatroom) => (
          <ListItem
            button
            key={chatroom.chatroomId}
            onClick={() => handleChatroomClick(chatroom.chatroomId)}
            selected={chatroom.chatroomId === selectedChatroom}
            className={`hover:bg-gray-700 ${
              chatroom.chatroomId === selectedChatroom ? 'bg-gray-800' : ''
            }`}
          >
            <ListItemText primary={chatroom.name} />
            {chatroom.isRemovable && (
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteChatroom(chatroom.chatroomId)}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: 'red',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No chatrooms available" />
        </ListItem>
      )}
    </List>
  )
}

export default ChatroomList
