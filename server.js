const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Appointment = require('./models/Appointment');
const Business = require('./models/Business');
const User = require('./models/User');
const Review = require('./models/Review');
require('dotenv').config();
const { Vonage } = require('@vonage/server-sdk')

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_KEY_CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "userPhotos",
  },
});

const upload = multer({ storage });


const app = express();
const PORT = process.env.PORT || 3000;
// const Mongo_Url = 'mongodb+srv://talkal:talkal123@cluster0.3gacv.mongodb.net/My-Tor?retryWrites=true&w=majority&appName=Cluster0';
const Mongo_Url = process.env.MONGO_URL;
const FRONTEND = process.env.FRONTEND;
const API_KEY_VONAGE = process.env.API_KEY_VONAGE
const API_KEY_VONAGE_SECRET = process.env.API_KEY_VONAGE_SECRET
const bcrypt = require('bcrypt');


app.use(express.json());
app.use(cors());


// ===== LOGS לבדיקה =====


// ------------------
// ROUTES - TESTING / BASE
// ------------------

// ברירת מחדל - בדיקת תקינות שרת
app.get('/blog', (req, res) => {
  res.send('Hello');
});

// ------------------
// ROUTES - USERS (משתמשים)
// ------------------

// שליפת כל המשתמשים
app.get('/user', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// הרשמה - יצירת משתמש חדש עם בדיקה אם המשתמש כבר קיים
app.post('/user', async (req, res) => {
  try {
    console.log("=== Incoming request body ===");
    console.log(req.body); // בדיקה מה מגיע בבקשה

    const { userName, password, email, city, gender, photo, phoneNumber } = req.body;

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      console.log("User already exists:", userName);
      return res.status(400).json({ message: 'This user is already signed up' });
    }

    const newUser = await User.create(req.body);
    console.log("New user created:", newUser);
    res.status(200).json(newUser);
  } catch (error) {
    console.error("Unexpected error in /user route:", error);
    res.status(500).json({ message: error.message });
  }
});




app.put('/user/:id' , async (req,res) => {
  const {id} = req.params
  const userChanges = req.body

  try {
  const findUser = await User.findByIdAndUpdate(id, userChanges, { new: true });

  if (!findUser) {
    return res.status(404).json({ message: `Cannot find user with ID ${id}` });
  }

  res.status(200).json(findUser);
} catch (error) {
  res.status(500).json({ message: error.message });
}
})

// התחברות משתמש - אימות מייל וסיסמא
app.post('/logIn', async (req, res) => {
  try {
    console.log("=== Incoming login request ===");
    console.log("req.body:", req.body);

    const { email, password } = req.body;
    console.log("Destructured email:", email);
    console.log("Destructured password (sent by user, plain text):", password);

    const user = await User.findOne({ email });
    console.log("Found user in DB:", user ? { email: user.email, password: user.password } : null);

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Incorrect password attempt for user:", email);
      return res.status(401).json({ message: 'Incorrect password' });
    }

    console.log("Login successful for user:", email);
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.log("Unexpected error in /logIn route:", error);
    res.status(500).json({ message: error.message });
  }
});



// ------------------
// ROUTES - BUSINESSES (עסקים)
// ------------------

// שליפת כל העסקים
app.get('/business', async (req, res) => {
  try {
    const businesses = await Business.find({});
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// שליפת עסק לפי מזהה
app.get('/business/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id);
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/business/category/:businessType', async (req, res) => {
  try {
    const { businessType } = req.params;

    const business = await Business.find({ businessType: businessType });

    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// יצירת עסק חדש, עם בדיקה אם העסק כבר קיים (על פי שם וטלפון)
app.post('/business', async (req, res) => {
  try {
    const { businessName, phone } = req.body;
    const findBusiness = await Business.findOne({ businessName, phone });

    if (findBusiness) {
      return res.status(400).json({ message: 'This business is already in the database' });
    }

    const business = await Business.create(req.body);
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// עדכון עסק קיים לפי מזהה, מחזיר את העסק המעודכן
app.put('/business/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findByIdAndUpdate(id, req.body, { new: true });
    if (!business) {
      return res.status(404).json({ message: `Cannot find business with ID ${id}` });
    }
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// מחיקת עסק לפי מזהה
app.delete('/business/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const findBusiness = await Business.findByIdAndDelete(id);
    if (!findBusiness) {
      return res.status(404).json({ message: `Cannot find business with ID ${id}` });
    }
    res.status(200).json(findBusiness);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/business/:id/rate', async (req, res) => { // עובד
  try {
    const { id } = req.params
    const { userId ,value,userName } = req.body
    console.log("BODY:", req.body);
    const business = await Business.findById(id);

    const businessRated = business.rating.find(rating => rating.userId?.toString() === userId )

    if(businessRated) {
      businessRated.value = value
      
    } else {
      business.rating.push({userId, value, userName})
     
    }
    await business.save()
    res.status(200).json(business.rating);

  } catch (error) {
    console.error("ERROR in /business/:id/rate:", error)
    res.status(500).json({ message: error.message });
  }
});

// ------------------
// ROUTES - APPOINTMENTS (תורים)
// ------------------

// שליפת כל התורים
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// שליפת תור לפי מזהה
app.get('/appointment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// שליפת תורים פעילים בלבד
app.get('/appointment/active', async (req, res) => {
  try {
    const appointments = await Appointment.find({ isActive: true });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// שליפת תורים לפי עסק, עם אופציה לסינון לפי תאריך
app.get('/appointment/business/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { date } = req.query;

    if (date) {
      const appointments = await Appointment.find({ businessId, date });
      res.status(200).json(appointments);
    } else {
      const appointments = await Appointment.find({ businessId });
      res.status(200).json(appointments);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// יצירת תור חדש - בדיקה אם התור תפוס לפני הוספה
app.post('/appointment', async (req, res) => {
  try {
    const { businessId, date, time } = req.body;
    const appointmentIsFull = await Appointment.findOne({ date, businessId, time, isActive: true });

    if (appointmentIsFull) {
      return res.status(400).json({ message: 'This appointment is full' });
    }

    const appointment = await Appointment.create(req.body);
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// מחיקת תור לפי מזהה
app.delete('/appointment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: `Cannot find appointment with ID ${id}` });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// עדכון תור לפי מזהה
app.put('/appointment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: `Cannot find appointment with ID ${id}` });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ביטול תור - הפיכת isActive ל-false
app.put('/appointment/cancel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: `Cannot find appointment with ID ${id}` });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// app.post("/upload", upload.single("photo"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // 🔍 כאן תראה בדיוק מה Cloudinary מחזיר
//     console.log("✅ Full file object:", req.file);

//     res.status(200).json({ imageUrl: req.file.path || req.file.url });
//   } catch (err) {
//     console.error("❌ Upload route error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });



app.post("/upload", upload.single("photo"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ Full file object:", req.file);

    res.status(200).json({
      imageUrl: req.file.path || req.file.url
    });
  } catch (err) {
    console.error("❌ Upload route error:", err);
    res.status(500).json({ message: err.message });
  }
});






const vonage = new Vonage({
  apiKey: API_KEY_VONAGE,
  apiSecret: API_KEY_VONAGE_SECRET 
})


app.post("/send-sms", async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ success: false, error: "Phone or message missing" });
  }

  try {
    const response = await vonage.sms.send({
      to: phone,             // המספר שאליו שולחים (בפורמט בינלאומי)
      from: "VonageAPI",     // השולח (לא תמיד יוצג)
      text: message
    });

    res.json({ success: true, response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


  
// ------------------
// START SERVER AND CONNECT TO DB
// ------------------

mongoose
  .connect(Mongo_Url)
  .then(() => {
    console.log('Connected To MongoDb');
    app.listen(PORT, () => {
      console.log('Node API is running on port', PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
