# express-authentication

Web Framework: Express
ORM: Sequelize
Linter: tslint
Node version: v18.16.0
Authentication: Express session
Schema Library: Zod

Authentication:

The two main options for this decision were session cookies and on JWT based authentication. The requirements do not provide enough information to confidently make a choice, however, because session cookies have well known simplicity, reliability and security benefits, it felt like a better choice with limited information. Session cookies do have the potential downside for performance and scalability because they must be stored in a database, however, an application would need quite high scalability requirements before this is an issue. Although because of time constraints, I chose to sequelize/MySQL as the session store, with more time I would investigate using Redis as the session store as it should have improved performance. JWT would be better for scenarios where speed is a priority, where clients are communicating with multiple servers using the same authentication mechanism or there is a lot of inter-server communication with many microservices.

ORM:

I chose sequelize because its a battle-tested ORM with a large user based and plenty of documentation. The downside of sequelize is the limited support for Typescript because of its longer legacy with javascript. If I started a new project, I would spend time to see if Prisma was a suitable option as it appears to have better support for Typescript.

Schema Library:

I chose Zod because of its ease of use for a small project. Joi and Yup would be of consideration for a larger project if more customization is needed.

Notes:

Although a .env file is included in the project, normally this file would be setup independently for dev, staging and prod.


Feedback:

There were a few inconsistencies in the swagger doc.
- The Get for /user/{userId}/profile displays the schema for the User even though the description implies a UserProfile should be returned with a 200
- The Patch for /user/ describes that the purpose is to update the UserProfile but also shows a the User scheme being returned with a 200