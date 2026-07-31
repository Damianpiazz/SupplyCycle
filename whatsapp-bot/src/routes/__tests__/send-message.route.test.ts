import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ─── Helpers ────────────────────────────────────────────────────────

function mockRes() {
  const writeHead = vi.fn().mockReturnThis()
  const end = vi.fn()
  return { writeHead, end }
}

function mockReq(overrides: Record<string, any> = {}) {
  return {
    body: { numero: '5492211234567', mensaje: 'Hola, esto es un test' },
    headers: { 'x-bot-api-key': 'test-key-123' },
    ...overrides,
  }
}

function mockBot(sendMessageImpl?: any) {
  return {
    provider: {
      sendMessage: vi.fn().mockImplementation(sendMessageImpl ?? (() => Promise.resolve())),
    },
  }
}

// ─── Tests: authMiddleware ─────────────────────────────────────────

describe('authMiddleware', () => {
  const VALID_KEY = 'test-key-123'

  beforeAll(() => {
    process.env['BOT_API_KEY_INCOMING'] = VALID_KEY
  })

  afterAll(() => {
    delete process.env['BOT_API_KEY_INCOMING']
  })

  it('rechaza si falta el header x-bot-api-key', async () => {
    const { authMiddleware } = await import('../send-message.route.js')
    const res = mockRes()
    const req = mockReq({ headers: {} })

    const result = authMiddleware(req, res)

    expect(result).toBe(false)
    expect(res.writeHead).toHaveBeenCalledWith(401, { 'Content-Type': 'application/json' })
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ status: 'error', error: 'Unauthorized: invalid or missing x-bot-api-key' }),
    )
  })

  it('rechaza si la API key es incorrecta', async () => {
    const { authMiddleware } = await import('../send-message.route.js')
    const res = mockRes()
    const req = mockReq({ headers: { 'x-bot-api-key': 'wrong-key' } })

    const result = authMiddleware(req, res)

    expect(result).toBe(false)
    expect(res.writeHead).toHaveBeenCalledWith(401, { 'Content-Type': 'application/json' })
  })

  it('acepta si la API key es correcta', async () => {
    const { authMiddleware } = await import('../send-message.route.js')
    const res = mockRes()
    const req = mockReq({ headers: { 'x-bot-api-key': VALID_KEY } })

    const result = authMiddleware(req, res)

    expect(result).toBe(true)
    expect(res.writeHead).not.toHaveBeenCalled()
  })
})

// ─── Tests: validarNumero ──────────────────────────────────────────

describe('validarNumero', () => {
  it('acepta un número de 10 dígitos', async () => {
    const { validarNumero } = await import('../send-message.route.js')
    const result = validarNumero('1155667890')
    expect(result.valido).toBe(true)
    if (result.valido) {
      expect(result.numeroLimpio).toBe('1155667890')
    }
  })

  it('acepta un número de 15 dígitos', async () => {
    const { validarNumero } = await import('../send-message.route.js')
    const result = validarNumero('549221123456789')
    expect(result.valido).toBe(true)
    if (result.valido) {
      expect(result.numeroLimpio).toBe('549221123456789')
    }
  })

  it('limpia +, espacios y guiones del número', async () => {
    const { validarNumero } = await import('../send-message.route.js')
    const result = validarNumero('+54 9 221 123-4567')
    expect(result.valido).toBe(true)
    if (result.valido) {
      expect(result.numeroLimpio).toBe('5492211234567')
    }
  })

  it('rechaza un número de menos de 10 dígitos', async () => {
    const { validarNumero } = await import('../send-message.route.js')
    const result = validarNumero('12345')
    expect(result.valido).toBe(false)
    if (!result.valido) {
      expect(result.error).toContain('10 y 15')
    }
  })

  it('rechaza un número de más de 15 dígitos', async () => {
    const { validarNumero } = await import('../send-message.route.js')
    const result = validarNumero('1234567890123456')
    expect(result.valido).toBe(false)
    if (!result.valido) {
      expect(result.error).toContain('10 y 15')
    }
  })
})

// ─── Tests: sendMessageHandler ─────────────────────────────────────

describe('sendMessageHandler', () => {
  const VALID_KEY = 'test-key-123'

  beforeAll(() => {
    process.env['BOT_API_KEY_INCOMING'] = VALID_KEY
  })

  afterAll(() => {
    delete process.env['BOT_API_KEY_INCOMING']
  })

  it('responde 400 si falta numero', async () => {
    const { sendMessageHandler } = await import('../send-message.route.js')
    const res = mockRes()
    const req = mockReq({
      body: { mensaje: 'test' },
      headers: { 'x-bot-api-key': VALID_KEY },
    })

    await sendMessageHandler(mockBot(), req, res)

    expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' })
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ status: 'error', error: 'Campo "numero" requerido' }),
    )
  })

  it('responde 400 si falta mensaje', async () => {
    const { sendMessageHandler } = await import('../send-message.route.js')
    const res = mockRes()
    const req = mockReq({
      body: { numero: '5492211234567' },
      headers: { 'x-bot-api-key': VALID_KEY },
    })

    await sendMessageHandler(mockBot(), req, res)

    expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' })
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ status: 'error', error: 'Campo "mensaje" requerido' }),
    )
  })

  it('responde 400 si el número tiene menos de 10 dígitos', async () => {
    const { sendMessageHandler } = await import('../send-message.route.js')
    const res = mockRes()
    const req = mockReq({
      body: { numero: '123', mensaje: 'test' },
      headers: { 'x-bot-api-key': VALID_KEY },
    })

    await sendMessageHandler(mockBot(), req, res)

    expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' })
  })

  it('responde 200 y envía el mensaje con JID correcto', async () => {
    const { sendMessageHandler } = await import('../send-message.route.js')
    const res = mockRes()
    const req = mockReq({ headers: { 'x-bot-api-key': VALID_KEY } })
    const bot = mockBot()

    await sendMessageHandler(bot, req, res)

    expect(bot.provider.sendMessage).toHaveBeenCalledWith(
      '5492211234567@s.whatsapp.net',
      'Hola, esto es un test',
    )
    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' })
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ status: 'ok' }))
  })

  it('responde 500 si sendMessage lanza un error', async () => {
    const { sendMessageHandler } = await import('../send-message.route.js')
    const res = mockRes()
    const req = mockReq({ headers: { 'x-bot-api-key': VALID_KEY } })
    const bot = mockBot(() => Promise.reject(new Error('Connection failed')))

    await sendMessageHandler(bot, req, res)

    expect(res.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' })
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ status: 'error', error: 'Connection failed' }),
    )
  })
})
