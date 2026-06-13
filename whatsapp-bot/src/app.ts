import 'dotenv/config'
import { createBot, createProvider, createFlow, MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { welcomeFlow, altaFlow, yaRegistradoFlow, pedidoFlow, noRegistradoFlow, reclamoFlow, cancelarFlow, bajaFlow } from './flows/index.js'
import { registerBlacklistRoutes } from './routes/index.js'

const PORT = process.env.PORT ?? 3008

const main = async () => {
  const adapterFlow = createFlow([welcomeFlow, altaFlow, yaRegistradoFlow, pedidoFlow, noRegistradoFlow, reclamoFlow, cancelarFlow, bajaFlow])

  const adapterProvider = createProvider(Provider, {
    version: [2, 3000, 1035824857],
  })

  const adapterDB = new Database()

  const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })

  registerBlacklistRoutes(
    adapterProvider.server.post.bind(adapterProvider.server),
    adapterProvider.server.get.bind(adapterProvider.server),
    handleCtx,
  )

  httpServer(+PORT)
}

main()
