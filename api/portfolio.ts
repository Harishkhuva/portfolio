import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from './db';

const COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 60 * 60 * 24; // 24 hours

type TableName =
  | 'profile'
  | 'settings'
  | 'skills'
  | 'platforms'
  | 'projects'
  | 'services';

function getCookie(req: any): string | null {
  const cookies = req.headers?.cookie;

  if (!cookies) return null;

  const match = cookies.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function verifySessionToken(token: string): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || !token) return false;

  const [timestamp, signature] = token.split('.');

  if (!timestamp || !signature) return false;

  const timestampNumber = Number(timestamp);

  if (!Number.isFinite(timestampNumber)) return false;

  const age = Date.now() - timestampNumber;

  if (age < 0 || age > SESSION_DURATION * 1000) {
    return false;
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(timestamp)
    .digest('base64url');

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function isAuthenticated(req: any): boolean {
  const token = getCookie(req);
  return token ? verifySessionToken(token) : false;
}

function sendJson(
  res: any,
  data: unknown,
  status = 200
) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

const ALLOWED_FIELDS: Record<TableName, string[]> = {
  profile: [
    'name',
    'headline',
    'subheadline',
    'bio',
    'email',
    'phone',
    'location',
    'years_exp',
    'projects_count',
    'available',
  ],

  settings: [
    'theme_color',
    'color_mode',
  ],

  skills: [
    'text',
    'sort_order',
  ],

  platforms: [
    'name',
    'count',
    'glyph',
    'color_class',
    'bg_class',
    'sort_order',
  ],

  projects: [
    'title',
    'platform',
    'category',
    'description',
    'tags',
    'accent',
    'image_url',
    'sort_order',
  ],

  services: [
    'title',
    'description',
    'price',
    'features',
    'icon',
    'sort_order',
  ],
};

function normalizeRow(table: TableName, row: any) {
  if (table === 'profile' && row) {
    return {
      ...row,
      available: Boolean(row.available),
    };
  }

  return row;
}

async function getPortfolioData() {
  const [
    profileResult,
    settingsResult,
    skillsResult,
    platformsResult,
    projectsResult,
    servicesResult,
  ] = await Promise.all([
    db.execute(
      'SELECT * FROM profile WHERE id = 1'
    ),

    db.execute(
      'SELECT * FROM settings WHERE id = 1'
    ),

    db.execute(
      'SELECT * FROM skills ORDER BY sort_order'
    ),

    db.execute(
      'SELECT * FROM platforms ORDER BY sort_order'
    ),

    db.execute(
      'SELECT * FROM projects ORDER BY sort_order'
    ),

    db.execute(
      'SELECT * FROM services ORDER BY sort_order'
    ),
  ]);

  return {
    profile: normalizeRow(
      'profile',
      profileResult.rows[0] ?? null
    ),

    settings: normalizeRow(
      'settings',
      settingsResult.rows[0] ?? null
    ),

    skills: skillsResult.rows,

    platforms: platformsResult.rows,

    projects: projectsResult.rows,

    services: servicesResult.rows,
  };
}

function getAllowedData(
  table: TableName,
  data: Record<string, any>
) {
  const allowed = ALLOWED_FIELDS[table];

  const result: Record<string, any> = {};

  for (const field of allowed) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      result[field] = data[field];
    }
  }

  return result;
}

async function updateRow(
  table: TableName,
  id: number,
  data: Record<string, any>
) {
  const cleanData = getAllowedData(table, data);

  const keys = Object.keys(cleanData);

  if (keys.length === 0) {
    throw new Error('No valid fields supplied');
  }

  const setClause = keys
    .map((key, index) => `"${key}" = ?`)
    .join(', ');

  const args = keys.map((key) => cleanData[key]);

  args.push(id);

  await db.execute({
    sql: `UPDATE ${table} SET ${setClause} WHERE id = ?`,
    args,
  });
}

async function insertRow(
  table: TableName,
  data: Record<string, any>
) {
  const cleanData = getAllowedData(table, data);

  const keys = Object.keys(cleanData);

  if (keys.length === 0) {
    throw new Error('No valid fields supplied');
  }

  const placeholders = keys
    .map(() => '?')
    .join(', ');

  const columns = keys
    .map((key) => `"${key}"`)
    .join(', ');

  const args = keys.map((key) => cleanData[key]);

  const result = await db.execute({
    sql: `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
    args,
  });

  return Number(result.lastInsertRowid);
}

async function deleteRow(
  table: TableName,
  id: number
) {
  await db.execute({
    sql: `DELETE FROM ${table} WHERE id = ?`,
    args: [id],
  });
}

async function getNextSortOrder(
  table: TableName
): Promise<number> {
  const result = await db.execute(
    `SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM ${table}`
  );

  const maxOrder = Number(
    result.rows[0]?.max_order ?? -1
  );

  return maxOrder + 1;
}

export default async function handler(
  req: any,
  res: any
) {
  try {
    /*
     * GET
     * Public portfolio data
     */
    if (req.method === 'GET') {
      const data = await getPortfolioData();

      return sendJson(res, data);
    }

    /*
     * All write operations require admin authentication.
     */
    if (!isAuthenticated(req)) {
      return sendJson(
        res,
        { error: 'Unauthorized' },
        401
      );
    }

    /*
     * POST
     * Create/update portfolio data
     */
    if (req.method === 'POST') {
      const body =
        typeof req.body === 'string'
          ? JSON.parse(req.body)
          : req.body ?? {};

      const action = body.action;
      const table = body.table as TableName;
      const id = Number(body.id);
      const data = body.data ?? {};

      /*
       * Update existing record
       */
      if (action === 'update') {
        if (!ALLOWED_FIELDS[table]) {
          return sendJson(
            res,
            { error: 'Invalid table' },
            400
          );
        }

        if (!Number.isFinite(id)) {
          return sendJson(
            res,
            { error: 'Invalid ID' },
            400
          );
        }

        await updateRow(table, id, data);

        return sendJson(res, {
          success: true,
        });
      }

      /*
       * Add new skill
       */
      if (action === 'addSkill') {
        const sortOrder = await getNextSortOrder('skills');

        const newId = await insertRow(
          'skills',
          {
            ...data,
            sort_order: sortOrder,
          }
        );

        return sendJson(res, {
          success: true,
          id: newId,
        });
      }

      /*
       * Add new platform
       */
      if (action === 'addPlatform') {
        const sortOrder =
          await getNextSortOrder('platforms');

        const newId = await insertRow(
          'platforms',
          {
            ...data,
            sort_order: sortOrder,
          }
        );

        return sendJson(res, {
          success: true,
          id: newId,
        });
      }

      /*
       * Add new project
       */
      if (action === 'addProject') {
        const sortOrder =
          await getNextSortOrder('projects');

        const newId = await insertRow(
          'projects',
          {
            ...data,
            sort_order: sortOrder,
          }
        );

        return sendJson(res, {
          success: true,
          id: newId,
        });
      }

      /*
       * Add new service
       */
      if (action === 'addService') {
        const sortOrder =
          await getNextSortOrder('services');

        const newId = await insertRow(
          'services',
          {
            ...data,
            sort_order: sortOrder,
          }
        );

        return sendJson(res, {
          success: true,
          id: newId,
        });
      }

      return sendJson(
        res,
        { error: 'Invalid action' },
        400
      );
    }

    /*
     * DELETE
     */
    if (req.method === 'DELETE') {
      const body =
        typeof req.body === 'string'
          ? JSON.parse(req.body)
          : req.body ?? {};

      const table = body.table as TableName;
      const id = Number(body.id);

      if (!ALLOWED_FIELDS[table]) {
        return sendJson(
          res,
          { error: 'Invalid table' },
          400
        );
      }

      if (!Number.isFinite(id)) {
        return sendJson(
          res,
          { error: 'Invalid ID' },
          400
        );
      }

      await deleteRow(table, id);

      return sendJson(res, {
        success: true,
      });
    }

    res.setHeader(
      'Allow',
      'GET, POST, DELETE'
    );

    return sendJson(
      res,
      { error: 'Method not allowed' },
      405
    );
  } catch (error) {
    console.error(
      'Portfolio API error:',
      error
    );

    return sendJson(
      res,
      { error: 'Internal server error' },
      500
    );
  }
}