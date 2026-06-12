type Handler = (bot: any, req: any, res: any) => Promise<any>
type Register = (path: string, ...handlers: any[]) => void

export function registerBlacklistRoutes(
  post: Register,
  get: Register,
  handleCtx: (handler: Handler) => any,
): void {
  post(
    '/v1/blacklist',
    handleCtx(async (bot, req, res) => {
      const { number, intent } = req.body
      if (intent === 'remove') bot.blacklist.remove(number)
      if (intent === 'add') bot.blacklist.add(number)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ status: 'ok', number, intent }))
    }),
  )

  get(
    '/v1/blacklist/list',
    handleCtx(async (bot, req, res) => {
      const blacklist = bot.blacklist.getList()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ status: 'ok', blacklist }))
    }),
  )
}
