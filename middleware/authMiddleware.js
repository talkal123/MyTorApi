const jwt = require("jsonwebtoken");              // טוען את הספרייה שאחראית על יצירה ובדיקה של טוקנים (JWT)
const JWT_SECRET = process.env.JWT_SECRET || "fallbackSecret123";
              // זה הסוד שחתם איתו השרת על הטוקנים – חייב להיות זהה גם לבדיקה
            
const authMiddleware = (req, res, next) => {     // יצרנו פונקציה שבודקת אם המשתמש שלח טוקן – כמו שומר בכניסה

  const authHeader = req.headers.authorization;  // מחפש אם המשתמש שלח טוקן בבקשה שלו – בתוך ה־headers
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" }); // אם לא שלח בכלל טוקן – עוצרים אותו ואומרים: "אין לך גישה"
  }

  const token = authHeader.split(" ")[1]; // מפרקים את המחרוזת כדי לקחת רק את החלק של הטוקן עצמו (בלי המילה "Bearer")

  if (!token) {
    return res.status(401).json({ message: "Token missing" }); // אם מסיבה כלשהי לא הצלחנו למצוא את הטוקן עצמו – מחזירים שגיאה
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // מנסים לבדוק אם הטוקן תקין – כלומר אם הוא לא מזויף ונחתם עם הסוד הנכון
    req.user = decoded; // אם הצלחנו – שומרים את פרטי המשתמש בתוך הבקשה, כדי שנוכל להשתמש בזה אחר כך

    next(); // הכל תקין! ממשיכים הלאה למי שבא אחר כך – למשל, הראוט שרוצה את הנתונים
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" }); // אם הטוקן לא תקין – שולחים תשובה של שגיאה: "הטוקן לא תקף"
  }
};

module.exports = authMiddleware;
