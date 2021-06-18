const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

const jokes = [
	{
		id: '0189hNRf2g',
		joke: "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
	},
	{
		id: '08EQZ8EQukb',
		joke: "Did you hear about the guy whose whole left side was cut off? He's all right now."
	},
	{
		id: '08xHQCdx5Ed',
		joke: 'Why didn’t the skeleton cross the road? Because he had no guts.'
	}
];

const user = {
	username: 'John',
	password: '123456789'
};

test('sanity', () => {
	expect(true).toBeTruthy();
	expect(process.env.NODE_ENV).toBe('testing');
});


beforeAll(async () => {
	await db.migrate.rollback();
	await db.migrate.latest();
});


beforeEach(async () => {
	await db('users').truncate();
});


afterAll(async () => {
	await db.destroy();
});


describe('Entry Functions', () => {

	describe('Register new user', () => {

		it('adds user to the db, return correct status code 201', async () => {

			let registered = await request(server)
				.post('/api/auth/register')
				.send(user);

			expect(registered.status).toBe(201);
		});


		it('returns the correct user', async () => {

			let registered = await request(server)
				.post('/api/auth/register')
				.send(user);

			expect(registered.body.username).toBe('John');
		});
	});


	describe('Login functions', () => {

		it('logs user into db', async () => {

			await request(server).post('/api/auth/register').send(user);

			let authorizedUser = await request(server)
				.post('/api/auth/login')
				.send(user);

			expect(authorizedUser.status).toBe(200);
		});


		it('responds with correct message', async () => {

			await request(server).post('/api/auth/register').send(user);

			let authorizedUser = await request(server)
				.post('/api/auth/login')
				.send(user);

			expect(authorizedUser.body.message).toEqual('welcome, John');
		});
	});


	describe('Getting Jokes', () => {

		it('return correct status code 200', async () => {

			await request(server).post('/api/auth/register').send(user);

			let res = await request(server).post('/api/auth/login').send(user);

			let jokes = await request(server)
				.get('/api/jokes')
				.set('Authorization', res.body.token);

			expect(jokes.status).toBe(200);
			expect(jokes.body).toHaveLength(3);
		});


		it('responds with correct jokes', async () => {

			await request(server).post('/api/auth/register').send(user);

			let res = await request(server).post('/api/auth/login').send(user);

			let receivedJokes = await request(server)
				.get('/api/jokes')
				.set('Authorization', res.body.token);
        
			expect(receivedJokes.body).toEqual(jokes);
		});
	});
});