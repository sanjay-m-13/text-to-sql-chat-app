'use client';

import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Button,
  Grow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const drawerWidth = 280;

// Mock conversation history data
const conversationHistory = [
  {
    id: "1",
    title: "User registration queries",
    lastMessage: "SELECT * FROM users WHERE...",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Product analytics",
    lastMessage: "How to find top selling products?",
    timestamp: "1 day ago",
  },
  {
    id: "3",
    title: "Order management",
    lastMessage: "JOIN orders with customers",
    timestamp: "2 days ago",
  },
  {
    id: "4",
    title: "Database optimization",
    lastMessage: "CREATE INDEX for better performance",
    timestamp: "1 week ago",
  },
];

interface ConversationHistoryProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export default function ConversationHistory({
  selectedConversation,
  onSelectConversation,
  onNewConversation,
}: ConversationHistoryProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'grey.50',
          borderRight: '1px solid',
          borderColor: 'grey.200',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          SQL Assistant
        </Typography>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewConversation}
          sx={{
            mb: 3,
            py: 1.5,
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: '0 4px 12px rgb(99 102 241 / 0.15)',
          }}
        >
          New Conversation
        </Button>
      </Box>
      
      <Divider />
      
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 600, mb: 1, px: 1 }}>
          Recent Conversations
        </Typography>
      </Box>
      
      <List sx={{ px: 2, flex: 1 }}>
        {conversationHistory.map((conversation, index) => (
          <Grow key={conversation.id} in timeout={300 + index * 100}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selectedConversation === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.50',
                    borderLeft: '3px solid',
                    borderColor: 'primary.main',
                  },
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'grey.800' }}>
                    {conversation.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'grey.600', 
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      mb: 0.5
                    }}
                  >
                    {conversation.lastMessage}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'grey.500' }}>
                    {conversation.timestamp}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          </Grow>
        ))}
      </List>
    </Drawer>
  );
}
