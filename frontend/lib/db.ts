import { Pool } from "pg"

// Create a PostgreSQL connection pool with proper limits
const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "promptplay",
  password: process.env.PGPASSWORD || "postgres",
  port: Number.parseInt(process.env.PGPORT || "5432"),
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
})

// Monitor the pool events
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// Helper function to execute SQL queries with retry logic
export async function query(text: string, params?: any[]) {
  const maxRetries = 3
  let retries = 0
  let lastError

  while (retries < maxRetries) {
    const client = await pool.connect()
    const start = Date.now()

    try {
      const res = await client.query(text, params)
      const duration = Date.now() - start
      console.log("Executed query", { text, duration, rows: res.rowCount })
      return res
    } catch (error: any) {
      lastError = error
      console.error("Error executing query", { text, error, attempt: retries + 1 })
      
      // Only retry on connection errors, not query errors
      if (error.code === 'ECONNREFUSED' || error.code === '57P01') {
        retries++
        await new Promise(resolve => setTimeout(resolve, 1000 * retries)) // Exponential backoff
        continue
      }
      throw error
    } finally {
      client.release()
    }
  }

  throw lastError
}

// User-related database functions
export async function getUserByEmail(email: string) {
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email])
    return result.rows[0]
  } catch (error) {
    console.error("Error in getUserByEmail:", error)
    throw error
  }
}

export async function getUserById(id: number) {
  try {
    const result = await query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows[0]
  } catch (error) {
    console.error("Error in getUserById:", error)
    throw error
  }
}

export async function createUser(name: string, email: string, passwordHash: string) {
  try {
    const result = await query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name, email, passwordHash]
    )
    return result.rows[0]
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      throw new Error("Email already exists")
    }
    console.error("Error in createUser:", error)
    throw error
  }
}

export async function updateUser(id: number, data: { name?: string; bio?: string; avatar_url?: string }) {
  try {
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramCount}`)
        values.push(value)
        paramCount++
      }
    })

    if (updates.length === 0) return null

    values.push(id)
    const queryText = `
      UPDATE users 
      SET ${updates.join(", ")}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await query(queryText, values)
    return result.rows[0]
  } catch (error) {
    console.error("Error in updateUser:", error)
    throw error
  }
}

// Session-related database functions with proper cleanup
export async function createSession(
  userId: number,
  token: string,
  expiresAt: Date,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    // First, clean up any expired sessions
    await cleanupExpiredSessions()

    const result = await query(
      `INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, token, expiresAt, ipAddress, userAgent]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error in createSession:", error)
    throw error
  }
}

export async function getSessionByToken(token: string) {
  try {
    const result = await query(
      `SELECT * FROM user_sessions WHERE session_token = $1 AND expires_at > NOW()`,
      [token]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error in getSessionByToken:", error)
    throw error
  }
}

export async function deleteSession(token: string) {
  try {
    await query("DELETE FROM user_sessions WHERE session_token = $1", [token])
  } catch (error) {
    console.error("Error in deleteSession:", error)
    throw error
  }
}

async function cleanupExpiredSessions() {
  try {
    await query("DELETE FROM user_sessions WHERE expires_at < NOW()")
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error)
  }
}

// Project-related database functions
export async function getUserProjects(userId: number) {
  const result = await query("SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC", [userId])
  return result.rows
}

export async function getProjectById(id: number, userId: number) {
  const result = await query("SELECT * FROM projects WHERE id = $1 AND user_id = $2", [id, userId])
  return result.rows[0]
}

export async function createProject(userId: number, title: string, description?: string, category?: string) {
  const result = await query(
    "INSERT INTO projects (user_id, title, description, category) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, title, description || null, category || null],
  )
  return result.rows[0]
}

export async function updateProject(
  id: number,
  userId: number,
  data: { title?: string; description?: string; content?: string; progress?: number },
) {
  const { title, description, content, progress } = data
  const updates = []
  const values = []
  let paramCount = 1

  if (title) {
    updates.push(`title = $${paramCount}`)
    values.push(title)
    paramCount++
  }

  if (description !== undefined) {
    updates.push(`description = $${paramCount}`)
    values.push(description)
    paramCount++
  }

  if (content !== undefined) {
    updates.push(`content = $${paramCount}`)
    values.push(content)
    paramCount++
  }

  if (progress !== undefined) {
    updates.push(`progress = $${paramCount}`)
    values.push(progress)
    paramCount++
  }

  if (updates.length === 0) return null

  values.push(id)
  values.push(userId)
  const result = await query(
    `UPDATE projects SET ${updates.join(", ")} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`,
    values,
  )
  return result.rows[0]
}

// AI suggestions database functions
export async function getProjectSuggestions(projectId: number) {
  const result = await query("SELECT * FROM ai_suggestions WHERE project_id = $1 ORDER BY created_at DESC", [projectId])
  return result.rows
}

export async function createAiSuggestion(projectId: number, suggestionType: string, content: string) {
  const result = await query(
    "INSERT INTO ai_suggestions (project_id, suggestion_type, content) VALUES ($1, $2, $3) RETURNING *",
    [projectId, suggestionType, content],
  )
  return result.rows[0]
}

// User activity logging
export async function logUserActivity(userId: number, activityType: string, details: any, ipAddress?: string) {
  await query("INSERT INTO user_activity_logs (user_id, activity_type, details, ip_address) VALUES ($1, $2, $3, $4)", [
    userId,
    activityType,
    JSON.stringify(details),
    ipAddress,
  ])
}

// Character-related database functions
export async function getCharactersByProject(projectId: number) {
  try {
    const result = await query(
      "SELECT * FROM characters WHERE project_id = $1 ORDER BY created_at DESC",
      [projectId]
    )
    return result.rows
  } catch (error) {
    console.error("Error in getCharactersByProject:", error)
    throw error
  }
}

export async function getCharacterById(id: number) {
  try {
    const result = await query("SELECT * FROM characters WHERE id = $1", [id])
    return result.rows[0]
  } catch (error) {
    console.error("Error in getCharacterById:", error)
    throw error
  }
}

export async function createCharacter(
  projectId: number,
  { name, role, description, background, personality, goals }: {
    name: string
    role?: string
    description?: string
    background?: string
    personality?: string
    goals?: string
  }
) {
  try {
    const result = await query(
      `INSERT INTO characters 
      (project_id, name, role, description, background, personality, goals)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [projectId, name, role, description, background, personality, goals]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error in createCharacter:", error)
    throw error
  }
}

export async function updateCharacter(
  id: number,
  { name, role, description, background, personality, goals }: {
    name?: string
    role?: string
    description?: string
    background?: string
    personality?: string
    goals?: string
  }
) {
  try {
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`)
      values.push(name)
      paramCount++
    }
    if (role !== undefined) {
      updates.push(`role = $${paramCount}`)
      values.push(role)
      paramCount++
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`)
      values.push(description)
      paramCount++
    }
    if (background !== undefined) {
      updates.push(`background = $${paramCount}`)
      values.push(background)
      paramCount++
    }
    if (personality !== undefined) {
      updates.push(`personality = $${paramCount}`)
      values.push(personality)
      paramCount++
    }
    if (goals !== undefined) {
      updates.push(`goals = $${paramCount}`)
      values.push(goals)
      paramCount++
    }

    if (updates.length === 0) return null

    values.push(id)
    const queryText = `UPDATE characters SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`
    const result = await query(queryText, values)
    return result.rows[0]
  } catch (error) {
    console.error("Error in updateCharacter:", error)
    throw error
  }
}

export async function deleteCharacter(id: number) {
  try {
    await query("DELETE FROM characters WHERE id = $1", [id])
  } catch (error) {
    console.error("Error in deleteCharacter:", error)
    throw error
  }
}
