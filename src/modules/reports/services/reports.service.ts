import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import * as PDFKit from 'pdfkit';

import RatingEntity from 'src/modules/media/entities/rating.entity';
import UsersEntity from 'src/modules/users/entities/users.entity';
import MediaEntity from 'src/modules/media/entities/media.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
  ) {}

  private async fetchAllData() {
    const users = await this.usersRepository.find({
      select: [
        'id',
        'profilePictureUrl',
        'username',
        'email',
        'accountType',
        'ratingCount',
        'lastLogin',
        'createdAt',
        'updatedAt',
      ],
    });

    const media = await this.mediaRepository.find({
      relations: ['user'],
    });

    const ratings = await this.ratingRepository.find({
      relations: ['user', 'media'],
    });

    return { users, media, ratings };
  }

  async generatePdfReport(res: Response): Promise<void> {
    const { users, media, ratings } = await this.fetchAllData();
    const doc = new PDFKit({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="ngplus_report.pdf"',
    );

    doc.pipe(res);

    doc.fontSize(18).text('Users Report', { underline: true });
    doc.moveDown();
    for (const user of users) {
      doc
        .fontSize(12)
        .text(
          `Username: ${user.username} (${user.accountType}) - Email: ${user.email}`,
        );
      doc
        .fontSize(10)
        .fillColor('grey')
        .text(
          `ID: ${user.id} | Ratings Given: ${user.ratingCount} | Created At: ${user.createdAt.toLocaleDateString()} | Updated At: ${user.updatedAt.toLocaleDateString()}`,
        );
      doc.moveDown(0.5);
    }

    doc
      .addPage()
      .fontSize(18)
      .fillColor('black')
      .text('Media Report', { underline: true });
    doc.moveDown();
    for (const m of media) {
      const mediaRatings = ratings.filter((r) => r.media?.id === m.id);
      const totalRatings = mediaRatings.length;
      const averageRating =
        totalRatings > 0
          ? mediaRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
          : 0;

      doc.fontSize(12).text(`Title: ${m.title} [${m.mediaCategory}]`);
      doc
        .fontSize(10)
        .fillColor('grey')
        .text(
          `ID: ${m.id} | Owner: ${m.user?.username || m.userId} | Total Ratings: ${totalRatings} | Avg Rating: ${averageRating.toFixed(2)}`,
        );
      doc.moveDown(0.5);
    }

    doc
      .addPage()
      .fontSize(18)
      .fillColor('black')
      .text('Ratings Report', { underline: true });
    doc.moveDown();
    for (const r of ratings) {
      doc.fontSize(12).text(`Rating: ${r.rating} stars - ID: ${r.id}`);
      doc
        .fontSize(10)
        .fillColor('grey')
        .text(
          `User: ${r.user?.username || 'N/A'} | Media: ${r.media?.title || 'N/A'} | Created At: ${r.createdAt.toLocaleDateString()} | Updated At: ${r.updatedAt.toLocaleDateString()}`,
        );
      doc.moveDown(0.5);
    }

    doc.end();
  }

  async generateExcelReport(res: Response): Promise<void> {
    const { users, media, ratings } = await this.fetchAllData();
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'NGPlus API';
    workbook.created = new Date();

    const usersSheet = workbook.addWorksheet('Users');
    usersSheet.columns = [
      { header: 'ID', key: 'id', width: 40 },
      { header: 'Username', key: 'username', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Account Type', key: 'accountType', width: 15 },
      { header: 'Ratings Given', key: 'ratingCount', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
    ];
    usersSheet.addRows(users);

    const mediaSheet = workbook.addWorksheet('Media');
    mediaSheet.columns = [
      { header: 'ID', key: 'id', width: 40 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Category', key: 'mediaCategory', width: 15 },
      { header: 'Owner ID', key: 'userId', width: 40 },
      { header: 'Owner Username', key: 'ownerUsername', width: 30 },
      { header: 'Content URL', key: 'contentUrl', width: 50 },
      { header: 'Total Ratings', key: 'totalRatings', width: 15 },
      { header: 'Average Rating', key: 'averageRating', width: 15 },
    ];

    mediaSheet.addRows(
      media.map((m) => {
        const mediaRatings = ratings.filter((r) => r.media?.id === m.id);
        const totalRatings = mediaRatings.length;
        const averageRating =
          totalRatings > 0
            ? mediaRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
            : 0;

        return {
          ...m,
          ownerUsername: m.user?.username || 'N/A',
          totalRatings,
          averageRating: Number.parseFloat(averageRating.toFixed(2)),
        };
      }),
    );

    const ratingsSheet = workbook.addWorksheet('Ratings');
    ratingsSheet.columns = [
      { header: 'ID', key: 'id', width: 40 },
      { header: 'Rating', key: 'rating', width: 10 },
      { header: 'User ID', key: 'userId', width: 40 },
      { header: 'User Username', key: 'userUsername', width: 30 },
      { header: 'Media ID', key: 'mediaId', width: 40 },
      { header: 'Media Title', key: 'mediaTitle', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
    ];
    ratingsSheet.addRows(
      ratings.map((r) => ({
        ...r,
        userUsername: r.user?.username || 'N/A',
        mediaTitle: r.media?.title || 'N/A',
      })),
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="ngplus_report.xlsx"',
    );

    const buffer = await workbook.xlsx.writeBuffer();
    res.end(buffer);
  }
}
