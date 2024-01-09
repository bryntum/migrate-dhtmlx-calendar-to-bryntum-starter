import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";
import path from "path";

dotenv.config();
global.__dirname = path.resolve();

const port = process.env.PORT || 1337;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("Server is running on port " + port + "...");
});

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

async function serverConfig() {
  app.get("/data", async (req, res) => {
    try {
      const results = await db.query("SELECT * FROM dhtmlx_calendar_events");
      const events = results[0];
      res.send({
        data: events,
      });
    } catch (error) {
      res.send({
        success: false,
      });
    }
  });

  // add a new event
  app.post("/data", async (req, res) => {
    const event = getEvent(req.body);
    try {
      const newEvent = await db.query(
        "INSERT INTO dhtmlx_calendar_events (start_date, end_date, text, event_pid, event_length, rec_type) VALUES (?, ?, ?, ?, ?, ?)",
        [
          new Date(event.start_date),
          new Date(event.end_date),
          event.text,
          event.event_pid || 0,
          event.event_length || 0,
          event.rec_type,
        ]
      );

      // delete a single occurrence from a recurring series
      let action = "inserted";
      if (event.rec_type == "none") {
        action = "deleted";
      }
      res.send({
        action: action,
        tid: newEvent[0].insertId,
      });
    } catch (error) {
      console.log({ error });
      res.send({
        success: false,
      });
    }
  });

  // update a event
  app.put("/data/:id", async (req, res) => {
    const eventId = req.params.id;
    const event = getEvent(req.body);
    try {
      const result = await updateEvent(eventId, event);
      res.send(result);
    } catch (error) {
      res.send({ success: false });
    }
  });

  // delete an event
  app.delete("/data/:id", async (req, res) => {
    const eventId = req.params.id;
    try {
      let event = await db.query(
        "SELECT * FROM dhtmlx_calendar_events WHERE id = ? LIMIT 1",
        [eventId]
      );

      if (event.event_pid) {
        event.rec_type = "none";
        const result = await updateEvent(eventId, event);
        return res.send(result);
      }

      if (event.rec_type && event.rec_type != "none") {
        // if a recurring series deleted, delete all modified occurrences of the series
        await db.query(
          "DELETE FROM dhtmlx_calendar_events WHERE event_pid = ?",
          [eventId]
        );
      }

      await db.query("DELETE FROM dhtmlx_calendar_events WHERE id = ?", [
        eventId,
      ]);

      res.send({
        action: "deleted",
      });
    } catch (error) {
      res.send({ success: false });
    }
  });

  function getEvent(data) {
    return {
      text: data.text,
      start_date: data.start_date,
      end_date: data.end_date,
      event_pid: data.event_pid,
      event_length: data.event_length,
      rec_type: data.rec_type,
    };
  }
}

serverConfig();
