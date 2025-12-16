const db = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

app.post("/api/login", (req, res) => {
  console.log("LOGIN HIT");

  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.json({ success: false, message: "DB error" });
    }

    if (results.length > 0) {
      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
        },
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
  });
});

// BOOK TICKET API
app.post("/api/book-ticket", (req, res) => {
  const { user_id, bus_number, seat_number } = req.body;

  if (!user_id || !bus_number || !seat_number) {
    return res.json({
      success: false,
      message: "All fields are required"
    });
  }

  const query =
    "INSERT INTO bookings (user_id, bus_number, seat_number) VALUES (?, ?, ?)";

  db.query(query, [user_id, bus_number, seat_number], (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: "Booking failed"
      });
    }

    res.json({
      success: true,
      message: "Ticket booked successfully",
      booking_id: result.insertId
    });
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
