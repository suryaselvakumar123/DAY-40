const express = require('express');


const app = express();
app.use(express.json());

let rooms = [
  {
    id: 1,
    name: 'Elite',
    seats: 50,
    roomId: 1,
    date: '2023-05-10',
    start: '11:00',
    amenities: ['Free-wifi', 'food', 'ac', 'ProjectionScreen','Cushions'],
    price: 5000,
    BookingStatus: 'Occupied',
     customerDetails: {
      customerName: 'surya',
      date: '2023-05-09',
      start: '09:00',
      end: '12:00',
      roomId: '1',
      status: 'Booked',
    },
  },
  {
    id: 2,
    name: 'Premium',
    seats: 100,
    roomId: 2,
    date: '2023-05-10',
    start: '11:00',
    amenities: ['Free-wifi', 'ac', 'Speaker System', 'Refreshments'],
    price: 1000,
    BookingStatus: 'Available',
    customerDetails: {
      customerName: '',
      date: '',
      start: '',
      end: '',
      roomId: '',
      status: '',
    },
  },
];

// Create a room
app.post('/rooms', (req, res) => {
  try {
    req.body.id = rooms.length + 1;
    rooms.push(req.body);
    res.status(201).json({
      message: 'Room created successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
      error,
    });
  }
});

// Book a room
app.post('/rooms/book', (req, res) => {
  try {
    let booked = false;
    let validRoomId = true;

    rooms.forEach((item) => {
      if (item.roomId == req.body.roomId) {
        validRoomId = false;
        if (
          new Date(item.date).getTime() != new Date(req.body.date).getTime() &&
          item.start != req.body.start
        ) {
          item.customerDetails = {
            customerName: req.body.name,
            date: req.body.date,
            start: req.body.start,
            end: req.body.end,
            roomId: req.body.roomId,
            status: 'Booked',
          };
          item.BookingStatus = 'Occupied';
          booked = true;
        }
      }
    });

    if (booked) {
      res.json({
        message: 'Booking Successful',
      });
    } else if (validRoomId) {
      res.status(400).json({
        message: 'Please enter a valid Room number',
      });
    } else {
      res.status(400).json({
        message: 'Booking Failed',
        instruction: 'Sorry! Room is already booked. Please check the availability.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
      error,
    });
  }
});

// List the customers
app.get('/rooms/customers', (req, res) => {
  try {
    const customerDetails = rooms
      .filter((item) => item.BookingStatus === 'Occupied')
      .map((item) => item.customerDetails);

    res.json({
      Customer_Details: customerDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error,
      });
  }
});

// List all rooms
app.get('/rooms', (req, res) => {
  try {
    res.json({
      Rooms: rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error,
    });
  }
});

// Update a room
app.put('/rooms/:id', (req, res) => {
  try {
    const roomId = parseInt(req.params.id);
    const updatedRoom = req.body;

    const index = rooms.findIndex((room) => room.id === roomId);

    if (index !== -1) {
      rooms[index] = { ...rooms[index], ...updatedRoom };
      res.json({
        message: 'Room updated successfully',
      });
    } else {
      res.status(404).json({
        message: 'Room not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error,
    });
  }
});

// Delete a room
app.delete('/rooms/:id', (req, res) => {
  try {
    const roomId = parseInt(req.params.id);
    const index = rooms.findIndex((room) => room.id === roomId);

    if (index !== -1) {
      rooms.splice(index, 1);
      res.json({
        message: 'Room deleted successfully',
      });
    } else {
      res.status(404).json({
        message: 'Room not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error,
    });
  }
});

const port = 7000;
app.listen(port, () => {
  console.log('Server started on port', port);
});


   
//http://localhost:7000/rooms -  the room details.
//http://localhost:7000/rooms/book - the booking details
//http://localhost:7000/rooms/customers 