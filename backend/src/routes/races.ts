import { Router } from 'express'
import { asyncHandler } from '../middlewares/api-utils'
import { latestPerformances, topPerformances } from '../controllers/races'

const router = Router()

router.get('/getLatestPerformances', asyncHandler(latestPerformances))
router.get('/topPerformances', asyncHandler(topPerformances))

export default router
