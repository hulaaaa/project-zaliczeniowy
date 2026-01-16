const API_URL = 'http://localhost:3000';


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

program.parse(process.argv);
