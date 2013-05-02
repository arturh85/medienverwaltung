var mongoose = require('mongoose'),
	should = require('should'),
	request = require('supertest'),
	app = require('../../backend'),
	context = describe,
	User = mongoose.model('user');

var cookies, count;

describe('Users', function () {
	describe('POST /api/user', function () {
		describe('Invalid parameters', function () {
			beforeEach(function (done) {
				User.count(function (err, cnt) {
					count = cnt
					done()
				})
			})


			it('should respond with errors when registering user with no email', function (done) {
				request(app)
					.post('/api/user')
					.send({
						fullname: 'Foo Bar',
						email: '',
						password: 'foobar'
					})
					.expect('Content-Type', /html/)
					.expect(400)
					.expect(/failed for path email/)
					.end(done)
			})

			it('should respond with ok when registering user with minimal filled fields', function (done) {
				request(app)
					.post('/api/user')
					.send({
						fullname: 'Foo Bar',
						email: 'foo@bar.com',
						password: 'foobar'
					})
					.expect('Content-Type', /html/)
					.expect(200)
					.expect(/OK/)
					.end(done)
			})
			/*

			it('should not save the user to the database', function (done) {
				User.count(function (err, cnt) {
					count.should.equal(cnt)
					done()
				})
			})
			*/
		})

		/*
		describe('Valid parameters', function () {
			beforeEach(function (done) {
				User.count(function (err, cnt) {
					count = cnt
					done()
				})
			})

			it('should redirect to /articles', function (done) {
				request(app)
					.post('/users')
					.field('name', 'Foo bar')
					.field('username', 'foobar')
					.field('email', 'foobar@example.com')
					.field('password', 'foobar')
					.expect('Content-Type', /plain/)
					.expect('Location', /\//)
					.expect(302)
					.expect(/Moved Temporarily/)
					.end(done)
			})

			it('should insert a record to the database', function (done) {
				User.count(function (err, cnt) {
					cnt.should.equal(count + 1)
					done()
				})
			})

			it('should save the user to the database', function (done) {
				User.findOne({ username: 'foobar' }).exec(function (err, user) {
					should.not.exist(err)
					user.should.be.an.instanceOf(User)
					user.email.should.equal('foobar@example.com')
					done()
				})
			})
		})
		*/
	})
})