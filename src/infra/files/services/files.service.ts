import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'node:path';
import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly logger = new Logger(FilesService.name);
  private readonly publicUrlBase: string;
  private readonly bucketName: string;
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    const isDocker = process.env.DOCKER === 'true';
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_KEY');
    const endpoint = isDocker
      ? 'minio'
      : this.configService.get<string>('S3_ENDPOINT');
    const port = this.configService.get<string>('S3_PORT');
    const useSsl = this.configService.get<string>('S3_USE_SSL') === 'true';
    this.publicUrlBase = this.configService.get<string>('S3_PUBLIC_URL')!;
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME')!;

    if (
      !endpoint ||
      !port ||
      !accessKeyId ||
      !secretAccessKey ||
      !this.bucketName ||
      !this.publicUrlBase
    ) {
      throw new Error('Incomplete configuration for S3 service.');
    }

    const s3Endpoint = `${useSsl ? 'https' : 'http'}://${endpoint}:${port}`;
    this.logger.log(`Setting up S3 Client for endpoint: ${s3Endpoint}`);

    this.s3 = new S3Client({
      endpoint: s3Endpoint,
      region: 'us-east-1', // dummy
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true, // required for MinIO
      tls: useSsl,
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      this.logger.log(`Bucket "${this.bucketName}" already exists.`);
    } catch (error: any) {
      if (error.$metadata?.httpStatusCode === 404) {
        this.logger.log(`Bucket "${this.bucketName}" not found. Creating...`);
        try {
          await this.s3.send(
            new CreateBucketCommand({ Bucket: this.bucketName }),
          );
          this.logger.log(`Bucket "${this.bucketName}" created successfully.`);
          await this.setPublicReadPolicy();
        } catch (creationError: any) {
          this.logger.error(
            `Failed to create bucket "${this.bucketName}": ${creationError.message}`,
          );
          throw new Error('Could not create S3 bucket.');
        }
      } else {
        this.logger.error(
          `Error checking bucket "${this.bucketName}": ${error.message}`,
        );
      }
    }
  }

  private async setPublicReadPolicy(): Promise<void> {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };

    try {
      await this.s3.send(
        new PutBucketPolicyCommand({
          Bucket: this.bucketName,
          Policy: JSON.stringify(policy),
        }),
      );
      this.logger.log(
        `Public read policy applied to bucket "${this.bucketName}".`,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to apply policy to bucket "${this.bucketName}": ${error.message}`,
      );
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'misc',
  ): Promise<string> {
    const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
    const fileName = `${folder}/${uniqueSuffix}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );

      const cleanPublicBase = this.publicUrlBase.replace(/\/$/, '');
      const fileUrl = `${cleanPublicBase}/${this.bucketName}/${fileName}`;
      this.logger.log(`File ${fileName} uploaded: ${fileUrl}`);
      return fileUrl;
    } catch (error: any) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw new InternalServerErrorException('Failed to upload file to S3.');
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl.startsWith(`${this.publicUrlBase}/${this.bucketName}/`)) {
        this.logger.error(
          `Invalid file URL or does not belong to the configured bucket: ${fileUrl}`,
        );
        throw new BadRequestException('Invalid file URL.');
      }

      const urlParts = new URL(fileUrl);
      const key = urlParts.pathname.substring(`/${this.bucketName}/`.length);

      if (!key) {
        this.logger.warn(`Could not extract file key from URL: ${fileUrl}`);
        return false;
      }

      await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
      );

      this.logger.log(`File ${key} deleted from bucket ${this.bucketName}`);
      return true;
    } catch (error: any) {
      this.logger.error(
        `Error deleting file ${fileUrl}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete file from S3.');
    }
  }
}
