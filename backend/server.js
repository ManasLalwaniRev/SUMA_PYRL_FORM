import express from 'express';
import cors from 'cors';
import pg from 'pg';
import session from 'express-session';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5001;
const saltRounds = 10;

// --- Middleware ---
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'a-very-secret-key-that-should-be-in-env',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
    }
}));


// --- PostgreSQL Connection ---
// Using a config object with environment variables
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  },
  keepAlive: true,
  keepAliveInitialDelay: 30000,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// --- Helper Functions ---
const sanitizeData = (data, dateFields) => {
  const sanitizedData = { ...data };
  for (const field of dateFields) {
    if (sanitizedData[field] === '' || sanitizedData[field] === null) {
      sanitizedData[field] = null;
    }
  }
  return sanitizedData;
};

// --- USER AUTHENTICATION & MANAGEMENT ROUTES ---
app.get('/api/check-auth', (req, res) => {
    // This route should be used for simple session checks, not full authentication.
    // Since Passport.js is removed, we'll check for a user in the session instead.
    if (req.session.userId) {
        res.json({ userId: req.session.userId, username: req.session.username, role: req.session.role, avatarUrl: req.session.avatarUrl });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip_address = req.ip;

  // Hardcoded check for development purposes
  if (username === 'admin' && password === 'password') {
    // For local testing, we simulate a user session
    req.session.userId = 'admin_user';
    req.session.username = 'admin';
    req.session.role = 'admin';
    req.session.avatarUrl = 'https://ui-avatars.com/api/?name=Admin+User';
    return res.json({ userId: 'admin_user', username: 'admin', role: 'admin', avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User' });
  }

  try {
    const result = await pool.query('SELECT * FROM PUBLIC.SUMA_users WHERE user_name = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });
    await pool.query('UPDATE PUBLIC.SUMA_users SET last_login = NOW(), ip_address = $1 WHERE user_id = $2', [ip_address, user.user_id]);
    
    // Store user info in session
    req.session.userId = user.user_id;
    req.session.username = user.user_name;
    req.session.role = user.user_role;
    req.session.avatarUrl = user.avatar_url;

    res.json({ userId: user.user_id, username: user.user_name, role: user.user_role, avatarUrl: user.avatar_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, user_name, user_role, avatar_url FROM PUBLIC.SUMA_users ORDER BY user_name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
    const { username, password, role, avatarUrl } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await pool.query(
            'INSERT INTO PUBLIC.SUMA_users (user_name, password, user_role, avatar_url) VALUES ($1, $2, $3, $4) RETURNING user_id, user_name, user_role, avatar_url',
            [username, hashedPassword, role, avatarUrl]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, role, avatarUrl } = req.body;
    try {
        const result = await pool.query(
            'UPDATE PUBLIC.SUMA_users SET user_name = $1, user_role = $2, avatar_url = $3 WHERE user_id = $4 RETURNING user_id, user_name, user_role, avatar_url',
            [username, role, avatarUrl, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

app.put('/api/users/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { avatarUrl } = req.body;
    try {
        const result = await pool.query(
            'UPDATE PUBLIC.SUMA_users SET avatar_url = $1 WHERE user_id = $2 RETURNING user_id, user_name, user_role, avatar_url',
            [avatarUrl, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

app.put('/api/users/change-password', async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await pool.query(
            'UPDATE PUBLIC.SUMA_users SET password = $1 WHERE user_id = $2',
            [hashedPassword, userId]
        );
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update password' });
    }
});


// --- Employee API Routes ---
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, "employeeName", "employeeId" FROM PUBLIC.SUMA_employees ORDER BY "employeeName"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM PUBLIC.SUMA_employees WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Payroll API Routes ---
app.get('/api/payroll', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PUBLIC.SUMA_payroll WHERE is_latest = TRUE ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/payroll', async (req, res) => {
  const client = await pool.connect();
  try {
    const data = sanitizeData(req.body, ['dateOfHire', 'reviewDate', 'todayDate', 'effectiveDate', 'nextReviewDate']);
    await client.query('BEGIN');
    const seqResult = await client.query("SELECT nextval(pg_get_serial_sequence('PUBLIC.SUMA_payroll','id')) AS new_id");
    const newEntityId = seqResult.rows[0].new_id;
    const insertQuery = `
      INSERT INTO PUBLIC.SUMA_payroll (id, entity_id, version, is_latest, "employeeName", "employeeId", "dateOfHire", "reviewDate", "currentJobTitle", "workLocation", "todayDate", "employeeClassCode", "employeeCode", description, "rateType", "flsaExempt", "reasonForChange", "currentSalary", "newSalary", "percentageAdjustment", "effectiveDate", "newJobTitle", "newSupervisorName", "newSupervisorId", "newProgram", "newDepartment", "nextReviewDate", "newEmployeeCode", "newRateType", "newFlsaExempt", comments)
      VALUES ($1, $1, 1, TRUE, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) RETURNING *;`;
    const values = [newEntityId, data.employeeName, data.employeeId, data.dateOfHire, data.reviewDate, data.currentJobTitle, data.workLocation, data.todayDate, data.employeeClassCode, data.employeeCode, data.description, data.rateType, data.flsaExempt, data.reasonForChange, data.currentSalary, data.newSalary, data.percentageAdjustment, data.effectiveDate, data.newJobTitle, data.newSupervisorName, data.newSupervisorId, data.newProgram, data.newDepartment, data.nextReviewDate, data.newEmployeeCode, data.newRateType, data.newFlsaExempt, data.comments];
    const newVersionResult = await client.query(insertQuery, values);
    await client.query('COMMIT');
    res.json(newVersionResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.put('/api/payroll/:entity_id', async (req, res) => {
  const { entity_id } = req.params;
  const data = sanitizeData(req.body, ['dateOfHire', 'reviewDate', 'todayDate', 'effectiveDate', 'nextReviewDate']);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const oldVersionResult = await client.query('SELECT version FROM PUBLIC.SUMA_payroll WHERE entity_id = $1 AND is_latest = TRUE', [entity_id]);
    if (oldVersionResult.rows.length === 0) throw new Error('Record to update not found.');
    const currentVersion = oldVersionResult.rows[0].version;
    await client.query('UPDATE PUBLIC.SUMA_payroll SET is_latest = FALSE WHERE entity_id = $1 AND is_latest = TRUE', [entity_id]);
    const insertQuery = `
      INSERT INTO PUBLIC.SUMA_payroll (entity_id, version, is_latest, "employeeName", "employeeId", "dateOfHire", "reviewDate", "currentJobTitle", "workLocation", "todayDate", "employeeClassCode", "employeeCode", description, "rateType", "flsaExempt", "reasonForChange", "currentSalary", "newSalary", "percentageAdjustment", "effectiveDate", "newJobTitle", "newSupervisorName", "newSupervisorId", "newProgram", "newDepartment", "nextReviewDate", "newEmployeeCode", "newRateType", "newFlsaExempt", comments)
      VALUES ($1, $2, TRUE, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29) RETURNING *;`;
    const values = [entity_id, currentVersion + 1, data.employeeName, data.employeeId, data.dateOfHire, data.reviewDate, data.currentJobTitle, data.workLocation, data.todayDate, data.employeeClassCode, data.employeeCode, data.description, data.rateType, data.flsaExempt, data.reasonForChange, data.currentSalary, data.newSalary, data.percentageAdjustment, data.effectiveDate, data.newJobTitle, data.newSupervisorName, data.newSupervisorId, data.newProgram, data.newDepartment, data.nextReviewDate, data.newEmployeeCode, data.newRateType, data.newFlsaExempt, data.comments];
    const newVersionResult = await client.query(insertQuery, values);
    await client.query('COMMIT');
    res.json(newVersionResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// --- Position Requisition API Routes ---
app.get('/api/requisitions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM PUBLIC.SUMA_position_requisitions ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/requisitions', async (req, res) => {
    try {
        const data = sanitizeData(req.body, ['requisitionDate', 'targetDate', 'approvalDate']);
        const insertQuery = `
            INSERT INTO PUBLIC.SUMA_position_requisitions ("requisitionNumber", "originalId", organization, "hrOrganization", "detailJobTitle", grade, "eeoCode", "jobCategory", "corporateOfficer", "requestedBy", "requisitionDate", "targetDate", "positionType", "numberOfOpenings", "newBusinessBudgetID", "newBusinessBudgetDescription", comments, status, approver, "approvalDate")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *;`;
        const values = [data.requisitionNumber, data.originalId, data.organization, data.hrOrganization, data.detailJobTitle, data.grade, data.eeoCode, data.jobCategory, data.corporateOfficer, data.requestedBy, data.requisitionDate, data.targetDate, data.positionType, data.numberOfOpenings, data.newBusinessBudgetID, data.newBusinessBudgetDescription, data.comments, data.status, data.approver, data.approvalDate];
        const result = await client.query(insertQuery, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
