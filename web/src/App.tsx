import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Heading, 
  SimpleGrid, 
  Tag, 
  Flex, 
  Text,
  useToast
} from '@chakra-ui/react';
import { type Ticket, TicketCard } from './components/TicketCard';

const API_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();



  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${API_URL}/tickets`);
        setTickets(res.data.reverse());
      } catch (err) {
        console.error('Failed to fetch tickets', err);
        toast({
          title: 'Error loading',
          description: "not received data REST",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      setIsConnected(true);
    };
    ws.onclose = () => setIsConnected(false);
    ws.onmessage = (event) => {
      const { event: type, data } = JSON.parse(event.data);

      if (type === 'TICKET_CREATED') {
        setTickets((prev) => [data, ...prev]);
        toast({
          title: 'New ticket!',
          description: data.title,
          status: 'info',
          position: 'top-right',
          duration: 3000,
        });
      } else if (type === 'TICKET_UPDATED') {
        setTickets((prev) =>
          prev.map((t) => (t.id === data.id ? data : t))
        );
        toast({
          title: 'Update status',
          description: `${data.title} -> ${data.status}`,
          status: 'success',
          position: 'top-right',
          duration: 3000,
        });
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={10}>
          <Box>
            <Heading as="h1" size="xl" color="blue.600">
              Monitoring Ticket
            </Heading>
            <Text color="gray.500">System of monitoring tickets in real-time</Text>
          </Box>
          
          <Tag 
            size="lg" 
            variant="solid" 
            colorScheme={isConnected ? 'green' : 'red'}
            borderRadius="full"
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </Tag>
        </Flex>


        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </SimpleGrid>


        {tickets.length === 0 && (
          <Box textAlign="center" mt={20} color="gray.400">
            <Heading size="md">Don't have active ticket</Heading>
            <Text>Use CLI to create new</Text>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;