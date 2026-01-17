import { Command } from 'commander';
import axios from 'axios';
import inquirer from 'inquirer';
import chalk from 'chalk';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_KEY = "dmytro";


const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY 
  }
});

const program = new Command();
program.name('ticket-cli').description('cli for management tickets').version('1.0.0');

const formatStatus = (status) => {
    switch (status) {
        case 'DONE': return chalk.green('DONE');
        case 'IN_PROGRESS': return chalk.yellow('IN_PROGRESS');
        case 'OPEN': return chalk.blue('OPEN');
        default: return status;
    }
};

const handleError = (error) => {
  if (error.response) {
    console.error(chalk.red(`\nServer error: ${error.response.status}, ${error.response.data.error || error.message}`));
  } else if (error.request) {
    console.error(chalk.red('\nServer not response. Start server'));
  } else {
    console.error(chalk.red(`\nerror: ${error.message}`));
  }
};

program
    .command('list')
    .description('show all')
    .action(async () => {
        try {
            const res = await client.get('/tickets');
            const tickets = res.data;

            console.log(chalk.bold('\nlist tickets: '));
            console.table(tickets.map(t => ({
                ID: t.id,
                Title: t.title,
                Status: t.status
            })));
        } catch (err) {
            handleError(err);
        }
    });

program
    .command('create')
    .description('create new ticket')
    .action(async () => {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'enter title of ticket: ',
                validate: input => input ? true : 'ENTER VALUE'
            },
            {
                type: 'input',
                name: 'description',
                message: 'description (not required): '
            }
        ]);

        const res = await client.post('/tickets', answers);
        console.log(chalk.green(`\n✔ succesful created ticket ID: ${res.data.id}`));

    } catch (err) {
        handleError(err);
    }
  });

  
program
  .command('update')
  .description('Update ticket status')
  .action(async () => {
    try {
      console.log(chalk.blue('Uploading list of tickets...'));
      
      const { data: tickets } = await client.get('/tickets');
      
      console.log('DEBUG: Received tickets:', tickets.length);
      if (tickets.length > 0) {
        console.log('DEBUG: First ticket (raw):', tickets[0]);
      }

      if (tickets.length === 0) {
        console.log(chalk.yellow('No ticket for updating.'));
        return;
      }

      const choices = tickets.map(t => ({
        name: `${t.id} - ${t.title} (${t.status})`,
        value: t.id
      }));

      const { ticketId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'ticketId',
          message: 'Select ticket for updating:',
          choices: choices
        }
      ]);
      
      console.log(`DEBUG: Selected ID: "${ticketId}"`); 
      
      const { newStatus } = await inquirer.prompt([
        {
          type: 'list',
          name: 'newStatus',
          message: 'New status:',
          choices: ['OPEN', 'IN_PROGRESS', 'DONE']
        }
      ]);
      console.log(`Sending PATCH request to URL: /tickets/${ticketId}`);
      await client.patch(`/tickets/${ticketId}`, { status: newStatus });
      console.log(chalk.green(`\n✔ Status of ticket ${ticketId} changed to ${newStatus}`));

    } catch (err) {
      handleError(err);
    }
  });

program.parse(process.argv);
