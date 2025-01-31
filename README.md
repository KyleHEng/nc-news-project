# Northcoders News API First Backend Project

Hosted Version using Supabase and Render:
https://northcoders-news-backend-project.onrender.com/api

# What This Is

The aim of this project was to mimic the behaviours of a backend API for websites like Reddit.

Interacting with an SQL database containing tables of users, comments, topics and articles,
to create various API calls to specified endpoints with their relevant queries.

# Instructions

1. Clone the repo from github

2. Run npm install to download the relevant packages for the repo.

3. To seed the database using psql, first run the setup-dbs script to create the database, then run the seed script to seed the database.

4. For testing, run the prepare script to install husky, which makes it easier to use Git hooks, and the test script will run files in the test directory.

5. Create .env files in the root directory of the repo that contains information for the PGDATABASE variable:

e.g.
.env.development

PGDATABASE = the_database

.env.test

PGDATABASE = the_test_database

6. Node.js v23.3.0 and PostgreSQL v16.6 were used in the making of this project

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
