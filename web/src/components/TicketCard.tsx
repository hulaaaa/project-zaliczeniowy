import React from 'react';
import { Card, CardBody, CardHeader, Heading, Text, Badge, Flex, Box } from '@chakra-ui/react';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
}

interface Props {
  ticket: Ticket;
}

export const TicketCard: React.FC<Props> = ({ ticket }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'green';
      case 'IN_PROGRESS': return 'yellow';
      case 'OPEN': return 'blue';
      default: return 'gray';
    }
  };

  const colorScheme = getStatusColor(ticket.status);

  return (
    <Card 
      borderLeft="4px solid" 
      borderLeftColor={`${colorScheme}.400`} 
      boxShadow="md"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
      transition="all 0.2s"
    >
      <CardHeader pb={0}>
        <Flex justify="space-between" align="center">
          <Text fontSize="xs" color="gray.500">#{ticket.id}</Text>
          <Text fontSize="xs" color="gray.500">
            {new Date(ticket.createdAt).toLocaleTimeString()}
          </Text>
        </Flex>
      </CardHeader>

      <CardBody>
        <Heading size="md" mb={2}>{ticket.title}</Heading>
        <Text fontSize="sm" color="gray.600" mb={4}>
          {ticket.description || 'Немає опису...'}
        </Text>
        
        <Box textAlign="right">
          <Badge colorScheme={colorScheme} variant="subtle" px={2} py={1} borderRadius="full">
            {ticket.status}
          </Badge>
        </Box>
      </CardBody>
    </Card>
  );
};