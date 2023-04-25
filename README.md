# express-authentication

Web Framework: Express
ORM: Sequelize
Linter: eslint
Node version: v18.16.0
Authentication: Express session
Schema Library: Zod

Authentication:

The two main options I considered for the authentication were session cookies and JWT authentication. With the limited information regarding scalability and overall architecture of the system, session cookies felt like a safer bet because of their simplicity, reliability and security benefits. Session cookies do have potential downsides for performance and scalability because they must be stored in a database, however, an application would need high scalability requirements before this becomes an issue. Because of time constraints, I chose to use sequelize/MySQL as the session store but with more time I would investigate using Redis as the session store as it should provide improved performance. JWT would be better for scenarios where speed is a priority. For example, in a situation where clients are communicating with multiple servers using the same authentication mechanism or where there is a lot of inter-server communication with many microservices. The main downside of JWT is that it is difficult to invalidate the token before it has reached its expiration.

ORM:

I chose sequelize because its a battle-tested ORM with a large user based and plenty of documentation. The downside of sequelize is the limited support for Typescript because of its longer legacy with javascript. If I started a new project, I would investigate Prisma to determine if it is a suitable option as it appears to have better support for Typescript.

Schema Library:

I chose Zod because of its ease of use for a small project. Joi and Yup would be of consideration for a larger project if more customization is needed.

Notes:

- Although a .env file is included in the project, normally this file would be setup independently for dev, staging and prod.
- Added a /register route for creating users for testing.
- Added a /logout route for testing authentication.

Testing:

Used Postman to test the routes.

Feedback:

Overall, I enjoyed working on this project because it felt open-ended enough to be able to make a lot of decisions but structured to keep it relevant and  also it was possible to build a functional project in a short amount of time.

There were a few inconsistencies in the swagger doc.
- The Get for /user/{userId}/profile displays the schema for the User even though the description implies a UserProfile should be returned with a 200.
- The Patch for /user/ describes that the purpose is to update the UserProfile but also shows the User scheme being returned with a 200 instead of UserProfile.