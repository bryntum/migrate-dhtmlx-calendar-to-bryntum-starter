# Migrate from DHTMLX Calendar to Bryntum Calendar tutorial: starter repository

## Set up a MySQL database locally

First set up a MySQL database locally by installing the MySQL Server and MySQL Workbench. MySQL Workbench is a MySQL GUI that we'll use to create a database with tables for the calendar data and to run queries. Download MySQL Server and MySQL Workbench from the MySQL community downloads page. If you're using Windows, you can use the MySQL Installer to download the MySQL products. Use the default configurations when configuring MySQL Server and Workbench. Make sure that you configure the MySQL Server to start at system startup for convenience.

Open the MySQL Workbench desktop application. Open the local instance of the MySQL Server that you configured.

We'll write our MySQL queries in the query tab and execute the queries by pressing the yellow lightning bolt button.

## Create a MySQL database for the DHTMLX data: Creating tables and example data

Let's run some MySQL queries in MySQL Workbench to create, use, and populate a database for our DHTMLX Calendar. Execute the following query to create a database called `dhtmlx_bryntum_calendar`:

```sql
CREATE DATABASE dhtmlx_bryntum_calendar;
```

Run the following query so that we set our newly created database for use:

```sql
USE dhtmlx_bryntum_calendar;
```

Let's create the table that we'll need for our basic DHTMLX Calendar data: `dhtmlx_calendar_events`

```sql
CREATE TABLE `dhtmlx_calendar_events`
(
    `id`           bigint(20) unsigned AUTO_INCREMENT,
    `start_date`   datetime NOT NULL,
    `end_date`     datetime NOT NULL,
    `text`         varchar(255)        DEFAULT NULL,
    `event_pid`    bigint(20) unsigned DEFAULT '0',
    `event_length` bigint(20) unsigned DEFAULT '0',
    `rec_type`     varchar(25)         DEFAULT '""',
    PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8;
```

Now add some example events data to the `dhtmlx_calendar_events` table:

```sql
INSERT INTO `dhtmlx_calendar_events` (id, text, start_date, end_date, event_pid, event_length, rec_type)
VALUES 
    (1, 'Co-working', '2024-01-08 09:00:00', '2024-01-08 12:30:00', null, null, null),
    (2, 'Project review', '2024-01-09 09:00:00', '2024-01-09 11:00:00', null, null, null),
    (3, 'Project planning', '2024-01-09 14:00:00', '2024-01-09 15:30:00', null, null, null),
    (4, 'Conference', '2024-01-10 10:00:00', '2024-01-10 11:30:00', null, null, null),
    (5, 'Interview', '2024-01-10 13:00:00', '2024-01-10 14:00:00', null, null, null),
    (6, 'Client meeting', '2024-01-11 09:00:00', '2024-01-11 09:30:00', null, null, null),
    (7, 'Presentation', '2024-01-11 14:00:00', '2024-01-11 15:30:00', null, null, null),
    (8, 'Sales meeting', '2024-01-11 16:00:00', '2024-01-11 17:00:00', null, null, null),
    (9, 'Budget review', '2024-01-12 09:00:00', '2024-01-12 10:00:00', null, null, null),
    (10, 'Excursion', '2024-01-12 13:00:00', '2024-01-12 17:00:00', null, null, null),
    (11, 'Stand up', '2024-01-08 08:00:00', '2024-01-12 08:40:00', '0', '2400', 'day_1___');
```

## Get the DHTMLX Scheduler PRO trial code

The tutorial uses the [DHTMLX Scheduler PRO version](https://dhtmlx.com/docs/products/dhtmlxScheduler/features.shtml), which has extra features such as a Timeline view. You can download a free 30-day trial of the PRO version [here](https://dhtmlx.com/docs/products/dhtmlxScheduler/download.shtml). The DHTMLX Scheduler is equivalent to the Bryntum Calendar and the DHTMLX Scheduler with a Timeline view is equivalent to the Bryntum Scheduler. We'll refer to the DHTMLX Scheduler as a calendar in the tutorial.

Once you've downloaded the trial code, copy the `dhtmlxscheduler.js` and `dhtmlxscheduler_material.css` files from the `codebase` folder and add them to the `public` folder of this repository.

## Install the dependencies and add the MySQL database connection details

Install the dependencies by running the following command:

```bash
npm install
```

In the `server.js` file, the Express server uses the MySQL2 library to connect to MySQL and run queries.

The `serverConfig` function runs when the server is started. It connects to the MySQL database. It also has some helper functions that are used for CRUD operations.

The `index.html` file in the public folder contains the HTML, CSS, and JavaScript for our DHTMLX scheduling calendar. We load the DHTMLX Scheduler JavaScript and CSS from the DHTMLX code that we coped into the `public` folder. The scheduler is initialized using the `init` method.

Now create a `.env` file in the root folder and add the following lines for connecting to your MySQL database:

```
HOST=localhost
PORT=1337
MYSQL_USER=root
PASSWORD=your-password
DATABASE=dhtmlx_bryntum_calendar
```

Don't forget to add the root password for your MySQL server. Run the local dev server by running the following command:

```bash
npm start
```

You'll see a DHTMLX Calendar with ten non-recurring events and one recurring event when you visit http://localhost:1337. The calendar will have full CRUD functionality.
