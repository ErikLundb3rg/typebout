import { Router } from 'express'
import { asyncHandler } from '../middlewares/api-utils'
import { latestPerformances } from '../controllers/races'

const router = Router()

router.get('/getLatestPerformances', asyncHandler(latestPerformances))

export default router
