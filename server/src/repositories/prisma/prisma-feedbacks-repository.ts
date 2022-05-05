import { prisma } from '../../prisma';
import { FeedbackCreateData, FeedbakcsRepository } from '../feedbacks-repository'

export class PrismaFeedbacksRepository implements FeedbakcsRepository {
  async create({ type, comment, screenshot }: FeedbackCreateData) {
    await prisma.feedback.create({
      data: {
        type,
        comment,
        screenshot,
      }
    });
  }
}