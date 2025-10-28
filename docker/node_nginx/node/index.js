const http = require('http');
const mysql = require('mysql');

const port = 3000;

const config = {
    host: 'mysql',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

function connectWithRetry() {
    const connection = mysql.createConnection(config);

    connection.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao MySQL. Tentando novamente em 5 segundos...', err.code);
            setTimeout(connectWithRetry, 5000);
            return;
        }

        console.log('Conectado ao banco de dados MySQL!');

        const createTable = `
            CREATE TABLE IF NOT EXISTS people (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255)
            )
        `;
        connection.query(createTable, (err) => {
            if (err) {
                console.error('Erro ao criar tabela:', err);
                return;
            }

            const insert = `INSERT INTO people(name) VALUES('nardone')`;
            connection.query(insert, (err) => {
                if (err) {
                    console.error('Erro ao inserir no banco:', err);
                }
            });
        });

        const server = http.createServer((req, res) => {
            if (req.url === '/' && req.method === 'GET') {
                const select = `SELECT name FROM people`;
                connection.query(select, (err, results) => {
                    if (err) {
                        console.error('Erro ao recuperar o dado do banco:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Erro ao acessar o banco de dados');
                        return;
                    }

                    const name = results.length > 0 ? results[0].name : 'Nenhum nome encontrado';

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`<h1>Full Cycle Rocks!</h1>\nNome: ${name}`);
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Página não encontrada');
            }
        });

        server.listen(port, () => {
            console.log('Servidor rodando na porta ' + port);
        });
    });
}

connectWithRetry();
