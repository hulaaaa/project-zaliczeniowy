import chalk from 'chalk';

const API_URL = 'http://localhost:3000';
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

program.parse(process.argv);
