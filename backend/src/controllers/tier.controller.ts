import { Request, Response } from 'express';
import { Failed, Success } from '../utils/apiResponse';
import { prisma } from '../../prisma/client';

export class TierController {
  static async getTiers(req: Request, res: Response) {
    const Tiers = await prisma.tier.findMany();

    return Success(res, 'Here is Tier data', Tiers);
  }
}
