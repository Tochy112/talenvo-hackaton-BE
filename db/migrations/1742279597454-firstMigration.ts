import { MigrationInterface, QueryRunner } from "typeorm";

export class  firstMigration1742279597454 implements MigrationInterface {
    name = 'firstMigration1742279597454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL DEFAULT 'user', \`description\` text NULL, \`updateDate\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleteDate\` datetime(6) NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rank\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`minXp\` int NOT NULL, \`maxXp\` int NOT NULL, \`badge\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_2ea61327360beb75f9b3f8d455\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`accounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`xp\` int NOT NULL DEFAULT '0', \`rank\` varchar(255) NULL, \`resetToken\` varchar(255) NULL, \`resetTokenExpiry\` datetime NULL, \`lastLogin\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`roleId\` int NULL, UNIQUE INDEX \`IDX_ee66de6cdc53993296d1ceb8aa\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`subject\` varchar(255) NOT NULL, \`outline\` text NOT NULL, \`content\` text NOT NULL, \`difficultyLevel\` varchar(255) NOT NULL, \`class\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`accountId\` int NULL, UNIQUE INDEX \`IDX_ac5edecc1aefa58ed0237a7ee4\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`questionText\` text NOT NULL, \`options\` json NOT NULL, \`correctAnswer\` varchar(255) NOT NULL, \`points\` int NOT NULL DEFAULT '1', \`quizId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`instruction\` text NOT NULL, \`passingScore\` int NOT NULL DEFAULT '0', \`maxScore\` int NOT NULL DEFAULT '0', \`xpReward\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz_attempt\` (\`id\` varchar(36) NOT NULL, \`score\` int NOT NULL DEFAULT '0', \`passed\` tinyint NOT NULL DEFAULT 0, \`answers\` json NULL, \`attemptedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` int NULL, \`quizId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_fb8505547017736dcb551014c17\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD CONSTRAINT \`FK_7170da49e8918cb5514bb57608e\` FOREIGN KEY (\`accountId\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD CONSTRAINT \`FK_4959a4225f25d923111e54c7cd2\` FOREIGN KEY (\`quizId\`) REFERENCES \`quiz\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz\` ADD CONSTRAINT \`FK_f74ae73a766eea8e0dfb09816ba\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempt\` ADD CONSTRAINT \`FK_0f6509709fa182ef1e58df93835\` FOREIGN KEY (\`userId\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_attempt\` ADD CONSTRAINT \`FK_6df8c7e41f7c5db85548efdb4fa\` FOREIGN KEY (\`quizId\`) REFERENCES \`quiz\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quiz_attempt\` DROP FOREIGN KEY \`FK_6df8c7e41f7c5db85548efdb4fa\``);
        await queryRunner.query(`ALTER TABLE \`quiz_attempt\` DROP FOREIGN KEY \`FK_0f6509709fa182ef1e58df93835\``);
        await queryRunner.query(`ALTER TABLE \`quiz\` DROP FOREIGN KEY \`FK_f74ae73a766eea8e0dfb09816ba\``);
        await queryRunner.query(`ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_4959a4225f25d923111e54c7cd2\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP FOREIGN KEY \`FK_7170da49e8918cb5514bb57608e\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_fb8505547017736dcb551014c17\``);
        await queryRunner.query(`DROP TABLE \`quiz_attempt\``);
        await queryRunner.query(`DROP TABLE \`quiz\``);
        await queryRunner.query(`DROP TABLE \`question\``);
        await queryRunner.query(`DROP INDEX \`IDX_ac5edecc1aefa58ed0237a7ee4\` ON \`course\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP INDEX \`IDX_ee66de6cdc53993296d1ceb8aa\` ON \`accounts\``);
        await queryRunner.query(`DROP TABLE \`accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ea61327360beb75f9b3f8d455\` ON \`rank\``);
        await queryRunner.query(`DROP TABLE \`rank\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
