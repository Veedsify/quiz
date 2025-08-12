# NSTM, Certification Course.
# Capstone Project Assessment

A comprehensive quiz application built with Next.js 15 for conducting travel health assessments. Features a clean, minimalistic UI with smooth animations and an admin dashboard for reviewing responses.

## 🚀 Features

- **Interactive Quiz Interface**: Multi-section assessment with various input types and smooth transitions
- **Multiple Input Types**: Binary choices, multiple choice, short text, and long text responses
- **Real-time Progress Tracking**: Visual progress bar and question counter
- **Auto-Submit Flow**: Automatic submission upon completion with thank you page
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **SQLite Database**: Stores all quiz responses locally
- **Admin Dashboard**: Password-protected admin panel to view all responses
- **Comprehensive Admin View**: Detailed response analysis with text input display
- **Smooth Animations**: Built with Framer Motion for engaging user experience
- **State Management**: Zustand for efficient state handling

## 📋 Assessment Sections

The quiz covers 7 key areas of travel health assessment:

1. **Introduction** (10 points)
2. **History Taking** (20 points)
3. **Risk Assessment** (20 points)
4. **Health Advice** (20 points)
5. **Documentation** (10 points)
6. **Communication Skills** (10 points)
7. **Professionalism** (10 points)

**Total Possible Score**: 100 points

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Database**: SQLite with sqlite3
- **UI Components**: Custom components with smooth transitions

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd QuizApp/quiz
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### For Quiz Takers

1. **Start the Assessment**:
   - Enter your full name and email address
   - Click "Start Assessment"

2. **Complete the Quiz**:
   - Answer questions across 7 different sections
   - Use the progress bar to track your completion
   - Navigate between questions using Previous/Next buttons

3. **View Results**:
   - See your overall score and percentage
   - Review section-by-section breakdown
   - Submit your results to the database

### For Administrators

1. **Access Admin Panel**:
   - Navigate to `/admin`
   - Enter the admin password: `admin123`

2. **View Responses**:
   - See all quiz responses in a table format
   - View scores, percentages, and completion dates
   - Click "View Details" for comprehensive response analysis

3. **Detailed Analysis**:
   - Review overall scores and section breakdowns
   - See individual question responses
   - Analyze scoring patterns

## 🔧 Configuration

### Admin Password

The default admin password is `admin123`. To change it:

1. Open `src/app/api/admin/route.ts`
2. Update the `ADMIN_PASSWORD` constant
3. For production, use environment variables:
   ```bash
   ADMIN_PASSWORD=your-secure-password
   ```

### Database

The SQLite database (`quiz.db`) is automatically created in the project root when the first response is submitted. No additional setup required.

## 📊 Database Schema

The application uses a single table structure:

```sql
CREATE TABLE quiz_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  accessors_name TEXT NOT NULL,
  accessors_email TEXT NOT NULL,
  responses TEXT NOT NULL,        -- JSON string of all responses
  total_score INTEGER NOT NULL,
  section_scores TEXT NOT NULL,   -- JSON string of section scores
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🎨 Customization

### Styling

The app uses Tailwind CSS for styling. Key design elements:

- **Color Scheme**: Blue/Indigo gradient theme
- **Typography**: Geist font family
- **Animations**: Framer Motion transitions
- **Layout**: Responsive grid and flexbox layouts

### Quiz Content

To modify quiz questions or scoring:

1. Edit `src/lib/quizData.ts`
2. Update the `quizData` array with your questions
3. Modify scoring logic in `src/app/page.tsx` if needed

## 🔍 API Endpoints

### POST `/api/quiz`
Submit quiz responses
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "responses": {...},
  "totalScore": 85,
  "sectionScores": [...]
}
```

### POST `/api/admin`
Admin operations (authentication required)
```json
{
  "password": "admin123",
  "action": "getAll" | "getById",
  "id": "1" // for getById action
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

For production deployment, consider setting:

```bash
ADMIN_PASSWORD=your-secure-password
DATABASE_URL=path-to-your-database
```

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:

- **Desktop**: Full-featured interface with optimal spacing
- **Tablet**: Adapted layouts for medium screens
- **Mobile**: Touch-friendly interface with vertical layouts

## 🔒 Security Considerations

- Admin access is password-protected
- Input validation on all forms
- SQL injection protection through parameterized queries
- XSS protection through React's built-in escaping

## 📈 Performance

- **Static Generation**: Next.js optimizations
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Use `npm run build` to analyze

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:

1. Check the existing documentation
2. Review the code comments
3. Create an issue in the repository
4. Contact the development team

---

**Note**: This application is designed for educational and assessment purposes. Ensure compliance with data protection regulations when collecting user information.
